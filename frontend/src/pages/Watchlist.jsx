import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
    Eye, Plus, X, Search, TrendingUp, TrendingDown,
    Star, ArrowUpRight
} from 'lucide-react'

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState(() => {
        const saved = localStorage.getItem('nepse_watchlist')
        return saved ? JSON.parse(saved) : []
    })
    const [stocks, setStocks] = useState([])
    const [watchlistData, setWatchlistData] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStocks()
        const interval = setInterval(fetchStockPrices, 15000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        localStorage.setItem('nepse_watchlist', JSON.stringify(watchlist))
        if (stocks.length > 0) updateWatchlistData()
    }, [watchlist, stocks])

    const fetchStocks = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/market/stocks`)
            setStocks(data || [])
        } catch (error) {
            console.error('Error fetching stocks:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStockPrices = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/market/stocks`)
            setStocks(data || [])
        } catch (error) {
            console.error('Error refreshing prices:', error)
        }
    }

    const updateWatchlistData = () => {
        const data = watchlist.map(symbol => {
            const stock = stocks.find(s => s.symbol === symbol)
            return stock || { symbol, name: 'Loading...', lastPrice: 0, changePercent: 0 }
        })
        setWatchlistData(data)
    }

    const addToWatchlist = (symbol) => {
        if (!watchlist.includes(symbol)) setWatchlist(prev => [...prev, symbol])
        setShowSearch(false)
        setSearchTerm('')
    }

    const removeFromWatchlist = (symbol) => {
        setWatchlist(prev => prev.filter(s => s !== symbol))
    }

    const filteredStocks = stocks.filter(s =>
        !watchlist.includes(s.symbol) && (
            s.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ).slice(0, 8)

    return (
        <div className="page-enter space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Eye className="h-7 w-7 text-primary-600" />
                        Watchlist
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">Track stocks you're interested in · {watchlist.length} stocks</p>
                </div>
                <button onClick={() => setShowSearch(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add Stock
                </button>
            </div>

            {watchlistData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {watchlistData.map((stock) => {
                        const isPositive = (stock.changePercent || stock.percentChange || 0) >= 0
                        const change = stock.changePercent || stock.percentChange || 0
                        const price = stock.lastPrice || stock.lastTradedPrice || 0

                        return (
                            <div key={stock.symbol} className="card group relative">
                                <button onClick={() => removeFromWatchlist(stock.symbol)}
                                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove from watchlist">
                                    <X className="h-4 w-4" />
                                </button>

                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                            <h3 className="text-lg font-bold text-gray-900">{stock.symbol}</h3>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate max-w-[180px]">
                                            {stock.name || stock.securityName || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-2xl font-extrabold text-gray-900">Rs. {price.toFixed(2)}</p>
                                        <div className="mt-1">
                                            <span className={`badge ${isPositive ? 'badge-success' : 'badge-danger'}`}>
                                                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                                {isPositive ? '+' : ''}{change.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                    <Link to={`/stock/${stock.symbol}`} className="btn-ghost flex items-center gap-1 text-sm">
                                        Details <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="card text-center py-20">
                    <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-5">
                        <Eye className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your watchlist is empty</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Add stocks to your watchlist to track their prices without adding them to your portfolio.
                    </p>
                    <button onClick={() => setShowSearch(true)} className="btn-primary inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Your First Stock
                    </button>
                </div>
            )}

            {showSearch && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-24 z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                        <div className="p-5 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Add to Watchlist</h2>
                                <button onClick={() => { setShowSearch(false); setSearchTerm('') }}
                                    className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search symbol or company name..." className="input pl-10" autoFocus />
                            </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {searchTerm && filteredStocks.length > 0 ? (
                                filteredStocks.map(stock => (
                                    <button key={stock.symbol} onClick={() => addToWatchlist(stock.symbol)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left">
                                        <div>
                                            <p className="font-semibold text-gray-900">{stock.symbol}</p>
                                            <p className="text-xs text-gray-400">{stock.name}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600">Rs. {(stock.lastPrice || stock.lastTradedPrice || 0).toFixed(2)}</span>
                                            <Plus className="h-4 w-4 text-primary-600" />
                                        </div>
                                    </button>
                                ))
                            ) : searchTerm ? (
                                <div className="text-center py-12 text-gray-400">
                                    <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                                    <p>No stocks found for "{searchTerm}"</p>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400"><p>Type to search for stocks</p></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Watchlist
