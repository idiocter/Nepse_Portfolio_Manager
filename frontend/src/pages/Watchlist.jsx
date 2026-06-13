import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import marketService from '../services/marketService'
import authService from '../services/authService'
import { useAuth } from '../contexts/AuthContext'

import {
    Eye, Plus, X, Search, TrendingUp, TrendingDown,
    Star, ArrowUpRight, Bookmark, Trash2
} from 'lucide-react'
import ConfirmModal from '../components/UI/ConfirmModal'

const Watchlist = () => {
    const { user, loading: authLoading } = useAuth()
    const [watchlist, setWatchlist] = useState([])
    const [stocks, setStocks] = useState([])
    const [watchlistData, setWatchlistData] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, symbol: '' })

    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (authLoading) return;

        if (user && user.watchlist) {
            setWatchlist(user.watchlist)
        } else {
            const key = `nepse_watchlist_guest`
            const saved = localStorage.getItem(key) || localStorage.getItem('nepse_watchlist')
            setWatchlist(saved ? JSON.parse(saved) : [])
        }
        setIsInitialized(true)
    }, [user, authLoading])

    useEffect(() => {
        fetchStocks()
        const interval = setInterval(fetchStockPrices, 15000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (stocks.length > 0 && isInitialized) {
            updateWatchlistData()
        }
    }, [watchlist, stocks, isInitialized])

    const fetchStocks = async () => {
        try {
            const data = await marketService.getStocks()
            setStocks(data || [])
        } catch (error) {
            console.error('Error fetching stocks:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchStockPrices = async () => {
        try {
            const data = await marketService.getStocks()
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

    const addToWatchlist = async (symbol) => {
        if (!watchlist.includes(symbol)) {
            const newWatchlist = [...watchlist, symbol]
            setWatchlist(newWatchlist)
            if (isInitialized) {
                if (user) {
                    try {
                        await authService.updateWatchlist(newWatchlist)
                    } catch (error) {
                        console.error('Failed to update watchlist on server', error)
                    }
                } else {
                    localStorage.setItem('nepse_watchlist_guest', JSON.stringify(newWatchlist))
                }
            }
        }
        setShowSearch(false)
        setSearchTerm('')
    }

    const removeFromWatchlist = (symbol) => {
        setDeleteModal({ isOpen: true, symbol })
    }

    const confirmRemove = async () => {
        const symbol = deleteModal.symbol
        const newWatchlist = watchlist.filter(s => s !== symbol)
        setWatchlist(newWatchlist)
        if (isInitialized) {
            if (user) {
                try {
                    await authService.updateWatchlist(newWatchlist)
                } catch (error) {
                    console.error('Failed to update watchlist on server', error)
                }
            } else {
                localStorage.setItem('nepse_watchlist_guest', JSON.stringify(newWatchlist))
            }
        }
    }

    const filteredStocks = stocks.filter(s =>
        !watchlist.includes(s.symbol) && (
            s.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    ).slice(0, 8)

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
                    <div className="h-8 sm:h-10 w-48 sm:w-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 sm:h-40 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">

                {/* Header - Responsive layout */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Watchlist
                        </h1>
                        <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'} tracked
                        </p>
                    </div>
                    <button
                        onClick={() => setShowSearch(true)}
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Add Stock</span>
                    </button>
                </div>

                {/* Watchlist Grid - Responsive columns */}
                {watchlistData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {watchlistData.map((stock) => {
                            const isPositive = (stock.changePercent || stock.percentChange || 0) >= 0
                            const change = stock.changePercent || stock.percentChange || 0
                            const price = stock.lastPrice || stock.lastTradedPrice || 0

                            return (
                                <div
                                    key={stock.symbol}
                                    className="group bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
                                >
                                    {/* Header - Always show remove button on mobile */}
                                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                            <div className="p-1.5 sm:p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg flex-shrink-0 transition-colors">
                                                <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 fill-amber-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight truncate">{stock.symbol}</h3>
                                                <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[120px] sm:max-w-[160px] mt-0.5">
                                                    {stock.name || stock.securityName || '—'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromWatchlist(stock.symbol)}
                                            className="p-1.5 sm:p-2 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                                            title="Remove from watchlist"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </button>
                                    </div>

                                    {/* Price & Change - Stack on very small screens */}
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-0">
                                        <div className="space-y-1 sm:space-y-2">
                                            <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight tabular-nums">
                                                Rs. {price.toFixed(2)}
                                            </p>
                                            <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black ${isPositive ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'}`}>
                                                {isPositive ? <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
                                                {isPositive ? '+' : ''}{change.toFixed(2)}%
                                            </div>
                                        </div>
                                        <Link
                                            to={`/stock/${stock.symbol}`}
                                            className="flex items-center justify-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:border-zinc-900 dark:hover:border-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all w-full sm:w-auto active:scale-95"
                                        >
                                            Details
                                            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    /* Empty State - Responsive padding */
                    <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 sm:p-12 lg:p-16 text-center transition-all duration-300">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-50 dark:bg-zinc-800 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-colors">
                            <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2 sm:mb-3 tracking-tight transition-colors">Your watchlist is empty</h3>
                        <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 mb-6 sm:mb-8 max-w-md mx-auto transition-colors">
                            Add stocks to track their prices and performance without adding them to your portfolio.
                        </p>
                        <button
                            onClick={() => setShowSearch(true)}
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
                        >
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                            Add Your First Stock
                        </button>
                    </div>
                )}

                {/* Search Modal - Better mobile positioning */}
                {showSearch && (
                    <div className="fixed inset-0 bg-zinc-950/40 dark:bg-zinc-950/60 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-32 z-50 p-4 transition-all duration-300">
                        <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[80vh] sm:max-h-none flex flex-col border border-zinc-100 dark:border-zinc-800">
                            {/* Modal Header */}
                            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0 transition-colors">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Add to Watchlist</h2>
                                    <button
                                        onClick={() => { setShowSearch(false); setSearchTerm('') }}
                                        className="p-1.5 sm:p-2 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                                    >
                                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 dark:text-zinc-500" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search symbol or company name..."
                                        className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-lg sm:rounded-xl text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Results - Scrollable */}
                            <div className="flex-1 overflow-y-auto">
                                {searchTerm && filteredStocks.length > 0 ? (
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {filteredStocks.map(stock => (
                                            <button
                                                key={stock.symbol}
                                                onClick={() => addToWatchlist(stock.symbol)}
                                                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                                            >
                                                <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                                    <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm sm:text-base tracking-tight">{stock.symbol}</p>
                                                    <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest truncate">{stock.name}</p>
                                                </div>
                                                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                                    <span className="text-xs sm:text-sm font-black text-zinc-600 dark:text-zinc-400 tabular-nums uppercase tracking-tighter">
                                                        Rs. {(stock.lastPrice || stock.lastTradedPrice || 0).toFixed(2)}
                                                    </span>
                                                    <div className="p-1.5 sm:p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg transition-colors">
                                                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-600 dark:text-zinc-400" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : searchTerm ? (
                                    <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-colors">
                                            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-400 dark:text-zinc-500" />
                                        </div>
                                        <p className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">No stocks found for "{searchTerm}"</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
                                        <p className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Type to search for stocks</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <ConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, symbol: '' })}
                    onConfirm={confirmRemove}
                    title="Remove from Watchlist"
                    message={`Are you sure you want to remove ${deleteModal.symbol} from your watchlist?`}
                    confirmText="Remove"
                />
            </div>
        </div>
    )
}

export default Watchlist