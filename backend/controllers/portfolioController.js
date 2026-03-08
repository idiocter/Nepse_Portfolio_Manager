import * as portfolioService from "../services/portfolioService.js";

export const getHoldings = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await portfolioService.fetchHoldingsWithPrices(userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addHolding = async (req, res) => {
  try {
    const { symbol, quantity, avgPrice } = req.body;
    const userId = req.user.id;

    const holdings = await portfolioService.addHoldingToPortfolio(userId, symbol, quantity, avgPrice);
    res.json({ message: "Holding added", holdings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editHolding = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { quantity, avgPrice } = req.body;
    const userId = req.user.id;

    const holdings = await portfolioService.editHoldingInPortfolio(userId, symbol, quantity, avgPrice);
    res.json({ message: "Holding updated", holdings });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteHolding = async (req, res) => {
  try {
    const { symbol } = req.params;
    const userId = req.user.id;

    const holdings = await portfolioService.deleteHoldingFromPortfolio(userId, symbol);
    res.json({ message: "Holding deleted", holdings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
