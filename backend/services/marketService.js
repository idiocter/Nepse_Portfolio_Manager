import { Nepse } from "@rumess/nepse-api";
import axios from "axios";
import https from "https";
import StockPrice from "../models/StockPrice.js";

const nepse = new Nepse();
const agent = new https.Agent({ rejectUnauthorized: false });

export const fetchMarketStatus = async () => {
    return await nepse.getMarketStatus();
};

export const fetchTopMovers = async (order = -1, limit = 10) => {
    return await StockPrice.find()
        .sort({ changePercent: order })
        .limit(limit);
};

export const fetchStockDetails = async (symbol) => {
    const rawDetails = await nepse.getSecurityDetails(symbol);

    // Map to frontend expected shape
    const tradeDto = rawDetails.securityDailyTradeDto || {};
    const security = rawDetails.security || {};

    return {
        ...tradeDto,
        ...security,
        ...rawDetails,
        securityName: security.securityName || rawDetails.securityName || 'N/A',
        lastTradedPrice: tradeDto.lastTradedPrice || 0,
        openPrice: tradeDto.openPrice || 0,
        highPrice: tradeDto.highPrice || 0,
        lowPrice: tradeDto.lowPrice || 0,
        previousClose: tradeDto.previousClose || 0,
        change: tradeDto.lastTradedPrice && tradeDto.previousClose ? Number((tradeDto.lastTradedPrice - tradeDto.previousClose).toFixed(2)) : 0,
        percentChange: tradeDto.lastTradedPrice && tradeDto.previousClose ? Number((((tradeDto.lastTradedPrice - tradeDto.previousClose) / tradeDto.previousClose) * 100).toFixed(2)) : 0,
        totalTradedQuantity: tradeDto.totalTradeQuantity || 0,
        outstandingShares: rawDetails.stockListedShares || 0,
        sectorName: security.companyId?.sectorMaster?.[0]?.sectorDescription || rawDetails.sectorName || security.sectorMaster?.[0]?.sectorDescription || 'N/A',
        lastUpdatedDate: rawDetails.updatedDate || tradeDto.lastUpdatedDateTime || new Date().toISOString()
    };
};

export const fetchStockHistory = async (symbol) => {
    symbol = symbol.toUpperCase();

    // Map symbol to securityId
    const keymap = await nepse.getSecuritySymbolIdKeymap();
    const securityId = keymap.get(symbol);

    let rawHistory;

    if (securityId) {
        try {
            // Try getting a larger size for manual fetch
            const accessToken = await nepse.tokenManager.getAccessToken();
            const response = await axios.get(`https://www.nepalstock.com.np/api/nots/market/security/price/${securityId}?size=500`, {
                headers: {
                    'Authorization': `Salter ${accessToken}`,
                    ...nepse.headers
                },
                httpsAgent: agent,
                timeout: 10000
            });
            rawHistory = response.data;
        } catch (err) {
            console.warn(`Manual history fetch failed for ${symbol}, falling back to library:`, err.message);
            rawHistory = await nepse.getSecurityPriceVolumeHistory(symbol);
        }
    } else {
        rawHistory = await nepse.getSecurityPriceVolumeHistory(symbol);
    }

    let history = [];

    if (rawHistory && Array.isArray(rawHistory.content)) {
        history = rawHistory.content
            .filter(item => item.businessDate && item.closePrice) // Guard against invalid data
            .map(item => ({
                date: item.businessDate.split('T')[0], // Ensure YYYY-MM-DD
                open: Number(item.openPrice) || 0,
                high: Number(item.highPrice) || 0,
                low: Number(item.lowPrice) || 0,
                close: Number(item.closePrice) || 0,
                volume: Number(item.totalTradedQuantity) || 0
            }));

        // Sort chronological (Oldest -> Newest) for lightweight-charts
        history.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Secondary Guard: If data is not strictly increasing, lightweight-charts will fail.
    // Ensure uniqueness and strict order.
    const uniqueHistory = [];
    const seenDates = new Set();
    for (const entry of history) {
        if (!seenDates.has(entry.date)) {
            uniqueHistory.push(entry);
            seenDates.add(entry.date);
        }
    }

    return uniqueHistory;
};

export const fetchAllStocks = async () => {
    return await StockPrice.find().sort({ symbol: 1 });
};

export const fetchSectorIndices = async () => {
    return await nepse.getNepseSubIndices();
};
