import { Nepse } from "@rumess/nepse-api";
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
    const rawDetails = await nepse.getSecurityDetails(symbol);

    // Map to frontend expected shape
    const tradeDto = rawDetails.securityDailyTradeDto || {};
    const security = rawDetails.security || {};

    const details = {
      ...tradeDto,
      ...security,
      ...rawDetails,
      securityName: security.securityName,
      change: tradeDto.lastTradedPrice && tradeDto.previousClose ? Number((tradeDto.lastTradedPrice - tradeDto.previousClose).toFixed(2)) : 0,
      percentChange: tradeDto.lastTradedPrice && tradeDto.previousClose ? Number((((tradeDto.lastTradedPrice - tradeDto.previousClose) / tradeDto.previousClose) * 100).toFixed(2)) : 0,
      totalTradedQuantity: tradeDto.totalTradeQuantity,
      outstandingShares: rawDetails.stockListedShares,
      sectorName: security.companyId?.sectorMaster?.[0]?.sectorDescription || rawDetails.sectorName || 'N/A',
      lastUpdatedDate: rawDetails.updatedDate || tradeDto.lastUpdatedDateTime || new Date().toISOString()
    };

    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;

    // Timeout mechanism because Nepse API can hang on this endpoint
    const historyPromise = nepse.getSecurityPriceVolumeHistory(symbol);
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve([]), 5000));

    let history = await Promise.race([historyPromise, timeoutPromise]);

    if (!Array.isArray(history)) {
      history = [];
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
