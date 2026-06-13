import { nepse, agent } from "../config/nepse.js";
import axios from "axios";
import StockPrice from "../models/StockPrice.js";

const SECTOR_IDS = [51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 64, 65, 66, 67];
const SECTOR_NAMES = {
  51: 'Banking', 52: 'Hotels & Tourism', 54: 'Hydro Power', 55: 'Development Bank',
  56: 'Manufacturing & Processing', 57: 'Others', 58: 'Others', 59: 'Non-Life Insurance',
  60: 'Finance', 61: 'Trading', 64: 'Microfinance', 65: 'Life Insurance',
  66: 'Mutual Fund', 67: 'Investment'
};

const getSectorMapping = async (accessToken) => {
  const symbolToSector = {};
  console.log("Building sector mapping...");

  for (const id of SECTOR_IDS) {
    try {
      if (id === 58) continue; // Skip generic index
      const url = `https://www.nepalstock.com.np/api/nots/securityDailyTradeStat/${id}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Salter ${accessToken}`,
          ...nepse.headers
        },
        httpsAgent: agent,
        timeout: 5000
      });

      if (Array.isArray(response.data)) {
        response.data.forEach(stock => {
          symbolToSector[stock.symbol] = SECTOR_NAMES[id];
        });
      }
    } catch (err) {
      console.warn(`Failed to fetch sector ${id} mapping: ${err.message}`);
    }
  }
  return symbolToSector;
};

const getSectorByKeyword = (symbol, name) => {
  const combined = `${symbol} ${name}`.toUpperCase();
  if (combined.includes('BANK')) {
    if (combined.includes('DEVELOPMENT') || combined.includes('BIKAS')) return 'Development Bank';
    return 'Banking';
  }
  if (combined.includes('HYDRO') || combined.includes(' URJA') || combined.includes(' POWER')) return 'Hydro Power';
  if (combined.includes('FINANCE')) return 'Finance';
  if (combined.includes('HOTEL') || combined.includes('TOURISM')) return 'Hotels & Tourism';
  if (combined.includes('LAGHUBITTA') || combined.includes('BITTIYA SANSTHA')) return 'Microfinance';
  if (combined.includes('INSURANCE')) {
    if (combined.includes('LIFE') && !combined.includes('NON-LIFE')) return 'Life Insurance';
    return 'Non-Life Insurance';
  }
  if (combined.includes('MUTUAL FUND')) return 'Mutual Fund';
  if (combined.includes('INVESTMENT')) return 'Investment';
  if (combined.includes('MANUFACTURING') || combined.includes('CEMENT')) return 'Manufacturing & Processing';
  return 'Others';
};

export const updateLivePrices = async () => {
  try {
    const liveData = await nepse.getLiveMarket();
    const accessToken = await nepse.tokenManager.getAccessToken();
    const sectorMap = await getSectorMapping(accessToken);

    const bulkOps = liveData.map((stock) => {
      const normalizedSymbol = stock.symbol.trim().toUpperCase();

      // Get sector from map, or fallback to keyword detection
      let sector = sectorMap[normalizedSymbol];
      if (!sector || sector === 'Others') {
        sector = getSectorByKeyword(normalizedSymbol, stock.securityName);
      }

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
              change: Number((stock.lastTradedPrice - stock.previousClose).toFixed(2)),
              changePercent: stock.percentageChange,
              volume: stock.totalTradeQuantity,
              indexId: stock.indexId,
              sector: sector,
              lastUpdated: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    if (bulkOps.length > 0) {
      await StockPrice.bulkWrite(bulkOps);
      console.log(`Updated ${bulkOps.length} stock prices with sector mapping`);
    }
  } catch (error) {
    console.error("Price update error:", error);
  }
};
