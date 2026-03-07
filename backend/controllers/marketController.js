import Nepse from '@rumess/nepse-api';
import StockPrice from '../models/StockPrice.js';

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
    const prices = await StockPrice.find().sort({ changePercent: -1 }).limit(10);
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
    const details = await nepse.getSecurityDetail(symbol);
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const history = await nepse.getPriceVolumeHistory(symbol);
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