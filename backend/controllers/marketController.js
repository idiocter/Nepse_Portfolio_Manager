import { Nepse } from "@rumess/nepse-api";
import axios from "axios";
import StockPrice from "../models/StockPrice.js";

const nepse = new Nepse();

export const getMarketStatus = async (req, res) => {
  try {
    const status = await nepse.getMarketStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopGainers = async (req, res) => {
  try {
    const prices = await StockPrice.find()
      .sort({ changePercent: -1 })
      .limit(10);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopLosers = async (req, res) => {
  try {
    const prices = await StockPrice.find().sort({ changePercent: 1 }).limit(10);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStockDetails = async (req, res) => {
  try {
    const { symbol } = req.params;
    if (!symbol || symbol === "undefined") {
      return res.status(400).json({ message: "Security symbol is required" });
    }
    const rawDetails = await nepse.getSecurityDetails(symbol);

    // Map to frontend expected shape
    const tradeDto = rawDetails.securityDailyTradeDto || {};
    const security = rawDetails.security || {};

    const details = {
      ...tradeDto,
      ...security,
      ...rawDetails,
      securityName: security.securityName || rawDetails.securityName || 'N/A',
      lastTradedPrice: tradeDto.lastTradedPrice || 0,
      openPrice: tradeDto.openPrice || 0,
      highPrice: tradeDto.highPrice || 0,
      lowPrice: tradeDto.lowPrice || 0,
      previousClose: tradeDto.previousClose || 0,
      change: tradeDto.lastTradedPrice && tradeDto.previousClose ? Number((tradeDto.lastTradedPrice - tradeDto.previousClose).toFixed(2)) : 0,
      percentChange: tradeDto.lastTradedPrice && tradeDto.previousClose ? Number((((tradeDto.lastTradedPrice - tradeDto.previousClose) / tradeDto.previousClose) * 100).toFixed(2)) : 0,
      totalTradedQuantity: tradeDto.totalTradeQuantity || 0,
      outstandingShares: rawDetails.stockListedShares || 0,
      sectorName: security.companyId?.sectorMaster?.[0]?.sectorDescription || rawDetails.sectorName || security.sectorMaster?.[0]?.sectorDescription || 'N/A',
      lastUpdatedDate: rawDetails.updatedDate || tradeDto.lastUpdatedDateTime || new Date().toISOString()
    };

    res.json(details);
  } catch (error) {
    console.error(`Error fetching details for ${req.params.symbol}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol || symbol === "undefined") {
      return res.status(400).json({ message: "Security symbol is required" });
    }

    // Try to get more than the default 10 points by appending size parameter if possible
    // Note: The library method doesn't support this, so we'll try to use the securityId directly
    const securityId = (await nepse.getSecuritySymbolIdKeymap()).get(symbol);
    let rawHistory;

    if (securityId) {
      // Manual fetch for more data points (last 300 days)
      const accessToken = await nepse.tokenManager.getAccessToken();
      const historyPromise = axios.get(`https://www.nepalstock.com.np/api/nots/market/security/price/${securityId}?size=300`, {
        headers: {
          'Authorization': `Salter ${accessToken}`,
          ...nepse.headers
        }
      }).then(r => r.data).catch(() => nepse.getSecurityPriceVolumeHistory(symbol)); // Fallback to library

      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve({ content: [] }), 30000));
      rawHistory = await Promise.race([historyPromise, timeoutPromise]);
    } else {
      rawHistory = await nepse.getSecurityPriceVolumeHistory(symbol);
    }
    let history = [];

    if (rawHistory && Array.isArray(rawHistory.content)) {
      history = rawHistory.content.map(item => ({
        date: item.businessDate,
        open: item.openPrice,
        high: item.highPrice,
        low: item.lowPrice,
        close: item.closePrice,
        volume: item.totalTradedQuantity
      })).reverse(); // Sort so the earliest date is first, as required by the chart
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await StockPrice.find().sort({ symbol: 1 });
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
