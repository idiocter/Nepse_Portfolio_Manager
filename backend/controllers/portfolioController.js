import User from "../models/User.js";
import StockPrice from "../models/StockPrice.js";

export const getHoldings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const prices = await StockPrice.find();

    const holdingsWithPrices = user.holdings.map((holding) => {
      const priceData = prices.find((p) => p.symbol === holding.symbol);
      const currentPrice = priceData?.lastPrice || holding.avgPrice;
      const indexId = priceData?.indexId || null;
      const sector = priceData?.sector || "Others";
      const investment = holding.quantity * holding.avgPrice;
      const currentValue = holding.quantity * currentPrice;

      return {
        ...holding.toObject(),
        currentPrice,
        indexId,
        sector,
        investment,
        currentValue,
        pnl: currentValue - investment,
        change: currentPrice - holding.avgPrice,
        changePercent:
          ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100,
      };
    });

    const totalInvestment = holdingsWithPrices.reduce(
      (sum, h) => sum + h.investment,
      0,
    );
    const totalCurrent = holdingsWithPrices.reduce(
      (sum, h) => sum + h.currentValue,
      0,
    );

    res.json({
      holdings: holdingsWithPrices,
      summary: {
        totalInvestment,
        totalCurrent,
        totalPnl: totalCurrent - totalInvestment,
        totalPnlPercent:
          totalInvestment > 0
            ? ((totalCurrent - totalInvestment) / totalInvestment) * 100
            : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addHolding = async (req, res) => {
  try {
    const { symbol, quantity, avgPrice } = req.body;
    const user = await User.findById(req.user.id);

    const existingIndex = user.holdings.findIndex(
      (h) => h.symbol === symbol.toUpperCase(),
    );

    if (existingIndex >= 0) {
      // Update existing holding using weighted average
      const existing = user.holdings[existingIndex];
      const totalQty = existing.quantity + quantity;
      const totalCost =
        existing.quantity * existing.avgPrice + quantity * avgPrice;
      existing.quantity = totalQty;
      existing.avgPrice = totalCost / totalQty;
    } else {
      user.holdings.push({
        symbol: symbol.toUpperCase(),
        quantity,
        avgPrice,
      });
    }

    await user.save();
    res.json({ message: "Holding added", holdings: user.holdings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editHolding = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { quantity, avgPrice } = req.body;
    const user = await User.findById(req.user.id);

    const holding = user.holdings.find(
      (h) => h.symbol === symbol.toUpperCase(),
    );
    if (!holding) {
      return res.status(404).json({ message: "Holding not found" });
    }

    holding.quantity = quantity;
    holding.avgPrice = avgPrice;

    await user.save();
    res.json({ message: "Holding updated", holdings: user.holdings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHolding = async (req, res) => {
  try {
    const { symbol } = req.params;
    const user = await User.findById(req.user.id);

    user.holdings = user.holdings.filter(
      (h) => h.symbol !== symbol.toUpperCase(),
    );
    await user.save();

    res.json({ message: "Holding deleted", holdings: user.holdings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
