import Nepse from '@rumess/nepse-api';
import StockPrice from '../models/StockPrice.js';

const nepse = new Nepse();

export const updateLivePrices = async () => {
  try {
    const liveData = await nepse.getLiveMarketData();
    
    const bulkOps = liveData.map(stock => ({
      updateOne: {
        filter: { symbol: stock.symbol },
        update: {
          $set: {
            symbol: stock.symbol,
            name: stock.securityName,
            lastPrice: stock.lastTradedPrice,
            open: stock.openPrice,
            high: stock.highPrice,
            low: stock.lowPrice,
            previousClose: stock.previousClose,
            change: stock.change,
            changePercent: stock.percentChange,
            volume: stock.totalTradedQuantity,
            lastUpdated: new Date()
          }
        },
        upsert: true
      }
    }));
    
    if (bulkOps.length > 0) {
      await StockPrice.bulkWrite(bulkOps);
      console.log(`Updated ${bulkOps.length} stock prices`);
    }
  } catch (error) {
    console.error('Price update error:', error);
  }
};