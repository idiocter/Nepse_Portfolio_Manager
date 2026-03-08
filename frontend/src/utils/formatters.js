export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount).replace('NPR', 'Rs.');
};

export const formatPercent = (percent) => {
    return `${percent > 0 ? '+' : ''}${percent?.toFixed(2)}%`;
};

export const formatVolume = (volume) => {
    return new Intl.NumberFormat('en-IN').format(volume);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};
