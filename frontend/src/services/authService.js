import api from './api';

const authService = {
    login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        return data;
    },

    register: async (name, email, password) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        return data;
    },

    googleLogin: async (tokenData) => {
        const { data } = await api.post('/auth/google', tokenData);
        return data;
    },

    getCurrentUser: async () => {
        const { data } = await api.get('/auth/me');
        return data;
    },

    updateWatchlist: async (watchlist) => {
        const { data } = await api.put('/auth/watchlist', { watchlist });
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

export default authService;
