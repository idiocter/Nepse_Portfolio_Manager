import * as marketService from "../services/marketService.js";

export const getMarketStatus = async (req, res) => {
  try {
    const status = await marketService.fetchMarketStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopGainers = async (req, res) => {
  try {
    const prices = await marketService.fetchTopMovers(-1);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopLosers = async (req, res) => {
  try {
    const prices = await marketService.fetchTopMovers(1);
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
    const details = await marketService.fetchStockDetails(symbol);
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

    const history = await marketService.fetchStockHistory(symbol);
    res.json(history);
  } catch (error) {
    console.error(`Error in getStockHistory for ${req.params.symbol}:`, error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await marketService.fetchAllStocks();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSectorIndices = async (req, res) => {
  try {
    const sectors = await marketService.fetchSectorIndices();
    res.json(sectors);
  } catch (error) {
    console.error('Error fetching sector indices:', error);
    res.status(500).json({ message: error.message });
  }
};
