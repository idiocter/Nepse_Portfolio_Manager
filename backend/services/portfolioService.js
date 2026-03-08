import User from "../models/User.js";
import StockPrice from "../models/StockPrice.js";

export const fetchHoldingsWithPrices = async (userId) => {
    const user = await User.findById(userId);
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

    return {
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
    };
};

export const addHoldingToPortfolio = async (userId, symbol, quantity, avgPrice) => {
    const user = await User.findById(userId);

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
    return user.holdings;
};

export const editHoldingInPortfolio = async (userId, symbol, quantity, avgPrice) => {
    const user = await User.findById(userId);

    const holding = user.holdings.find(
        (h) => h.symbol === symbol.toUpperCase(),
    );
    if (!holding) {
        throw new Error("Holding not found");
    }

    holding.quantity = quantity;
    holding.avgPrice = avgPrice;

    await user.save();
    return user.holdings;
};

export const deleteHoldingFromPortfolio = async (userId, symbol) => {
    const user = await User.findById(userId);

    user.holdings = user.holdings.filter(
        (h) => h.symbol !== symbol.toUpperCase(),
    );
    await user.save();
    return user.holdings;
};
