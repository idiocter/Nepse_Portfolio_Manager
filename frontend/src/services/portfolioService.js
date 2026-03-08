import api from './api';

const portfolioService = {
    getHoldings: async () => {
        const { data } = await api.get('/portfolio');
        return data;
    },

    addHolding: async (symbol, quantity, avgPrice) => {
        const { data } = await api.post('/portfolio', { symbol, quantity, avgPrice });
        return data;
    },

    editHolding: async (symbol, quantity, avgPrice) => {
        const { data } = await api.put(`/portfolio/${symbol}`, { quantity, avgPrice });
        return data;
    },

    deleteHolding: async (symbol) => {
        const { data } = await api.delete(`/portfolio/${symbol}`);
        return data;
    }
};

export default portfolioService;
