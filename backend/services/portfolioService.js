import User from "../models/User.js";
import StockPrice from "../models/StockPrice.js";

export const fetchHoldingsWithPrices = async (userId) => {
    const user = await User.findById(userId);
    const prices = await StockPrice.find();

    const holdingsWithPrices = user.holdings.map((holding) => {
        const normalizedHoldingSymbol = holding.symbol.trim().toUpperCase();
        const priceData = prices.find((p) => p.symbol.trim().toUpperCase() === normalizedHoldingSymbol);

        // If we have price data, use lastPrice. Otherwise, we can fallback to avgPrice 
        // but it's better to be explicit that data might be missing.
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
            dailyChange: priceData?.change || 0,
            dailyChangePercent: priceData?.changePercent || 0,
            pnlPercent:
                holding.avgPrice > 0
                    ? ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100
                    : 0,
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
    const normalizedSymbol = symbol.trim().toUpperCase();

    const existingIndex = user.holdings.findIndex(
        (h) => h.symbol === normalizedSymbol,
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
            symbol: normalizedSymbol,
            quantity,
            avgPrice,
        });
    }

    await user.save();
    return user.holdings;
};

export const editHoldingInPortfolio = async (userId, symbol, quantity, avgPrice) => {
    const user = await User.findById(userId);

    const normalizedSymbol = symbol.trim().toUpperCase();
    const holding = user.holdings.find(
        (h) => h.symbol === normalizedSymbol,
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

    const normalizedSymbol = symbol.trim().toUpperCase();
    user.holdings = user.holdings.filter(
        (h) => h.symbol !== normalizedSymbol,
    );
    await user.save();
    return user.holdings;
};
