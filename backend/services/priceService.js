import { nepse } from "../config/nepse.js";
import StockPrice from "../models/StockPrice.js";


export const updateLivePrices = async () => {
  try {
    const liveData = await nepse.getLiveMarket();

    const SECTOR_ID_MAP = {
      51: 'Banking', 52: 'Hotels', 54: 'Hydro', 55: 'Dev Bank',
      56: 'Manufacturing', 59: 'Non-Life Insurance', 60: 'Finance',
      61: 'Trading', 64: 'Microfinance', 65: 'Life Insurance',
      66: 'Mutual Fund', 67: 'Investment'
    };

    const bulkOps = liveData.map((stock) => {
      const normalizedSymbol = stock.symbol.trim().toUpperCase();
      return {
        updateOne: {
          filter: { symbol: normalizedSymbol },
          update: {
            $set: {
              symbol: normalizedSymbol,
              name: stock.securityName,
              lastPrice: stock.lastTradedPrice,
              open: stock.openPrice,
              high: stock.highPrice,
              low: stock.lowPrice,
              previousClose: stock.previousClose,
              change: Number(
                (stock.lastTradedPrice - stock.previousClose).toFixed(2),
              ),
              changePercent: stock.percentageChange,
              volume: stock.totalTradeQuantity,
              indexId: stock.indexId,
              sector: SECTOR_ID_MAP[stock.indexId] || 'Others',
              lastUpdated: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    if (bulkOps.length > 0) {
      await StockPrice.bulkWrite(bulkOps);
      console.log(`Updated ${bulkOps.length} stock prices`);
    }
  } catch (error) {
    console.error("Price update error:", error);
  }
};
