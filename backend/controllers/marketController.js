import { Nepse } from "@rumess/nepse-api";
import axios from "axios";
import https from "https";
import StockPrice from "../models/StockPrice.js";

const nepse = new Nepse();
const agent = new https.Agent({ rejectUnauthorized: false });

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
    let { symbol } = req.params;
    if (!symbol || symbol === "undefined") {
      return res.status(400).json({ message: "Security symbol is required" });
    }

    symbol = symbol.toUpperCase();

    // Map symbol to securityId
    const keymap = await nepse.getSecuritySymbolIdKeymap();
    const securityId = keymap.get(symbol);

    let rawHistory;

    if (securityId) {
      try {
        // Try getting a larger size for manual fetch
        const accessToken = await nepse.tokenManager.getAccessToken();
        const response = await axios.get(`https://www.nepalstock.com.np/api/nots/market/security/price/${securityId}?size=500`, {
          headers: {
            'Authorization': `Salter ${accessToken}`,
            ...nepse.headers
          },
          httpsAgent: agent,
          timeout: 10000
        });
        rawHistory = response.data;
      } catch (err) {
        console.warn(`Manual history fetch failed for ${symbol}, falling back to library:`, err.message);
        rawHistory = await nepse.getSecurityPriceVolumeHistory(symbol);
      }
    } else {
      rawHistory = await nepse.getSecurityPriceVolumeHistory(symbol);
    }

    let history = [];

    if (rawHistory && Array.isArray(rawHistory.content)) {
      history = rawHistory.content
        .filter(item => item.businessDate && item.closePrice) // Guard against invalid data
        .map(item => ({
          date: item.businessDate.split('T')[0], // Ensure YYYY-MM-DD
          open: Number(item.openPrice) || 0,
          high: Number(item.highPrice) || 0,
          low: Number(item.lowPrice) || 0,
          close: Number(item.closePrice) || 0,
          volume: Number(item.totalTradedQuantity) || 0
        }));

      // Sort chronological (Oldest -> Newest) for lightweight-charts
      history.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Secondary Guard: If data is not strictly increasing, lightweight-charts will fail.
    // Ensure uniqueness and strict order.
    const uniqueHistory = [];
    const seenDates = new Set();
    for (const entry of history) {
      if (!seenDates.has(entry.date)) {
        uniqueHistory.push(entry);
        seenDates.add(entry.date);
      }
    }

    res.json(uniqueHistory);
  } catch (error) {
    console.error(`Error in getStockHistory for ${req.params.symbol}:`, error);
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

export const getSectorIndices = async (req, res) => {
  try {
    const sectors = await nepse.getNepseSubIndices();
    res.json(sectors);
  } catch (error) {
    console.error('Error fetching sector indices:', error);
    res.status(500).json({ message: error.message });
  }
};
