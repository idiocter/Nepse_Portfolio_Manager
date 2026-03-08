import api from './api';

const marketService = {
    getStocks: async () => {
        const { data } = await api.get('/market/stocks');
        return data;
    },

    getStockDetail: async (symbol) => {
        const { data } = await api.get(`/market/stock/${symbol}`);
        return data;
    },

    getChartData: async (symbol) => {
        const { data } = await api.get(`/market/history/${symbol}`);
        return data;
    },

    getSectorIndices: async () => {
        const { data } = await api.get('/market/sectors');
        return data;
    },

    getGainers: async () => {
        const { data } = await api.get('/market/gainers');
        return data;
    },

    getLosers: async () => {
        const { data } = await api.get('/market/losers');
        return data;
    }
};


export default marketService;
