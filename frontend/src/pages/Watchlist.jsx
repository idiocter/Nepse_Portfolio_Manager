import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import marketService from '../services/marketService'
import authService from '../services/authService'
import { useAuth } from '../contexts/AuthContext'
import { Eye, Plus, X, Search, ArrowUpRight, Trash2 } from 'lucide-react'
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
        if (authLoading) return
        if (user && user.watchlist) setWatchlist(user.watchlist)
        else {
            const saved = localStorage.getItem('nepse_watchlist_guest') || localStorage.getItem('nepse_watchlist')
            setWatchlist(saved ? JSON.parse(saved) : [])
        }
        setIsInitialized(true)
    }, [user, authLoading])

    useEffect(() => {
        fetchStocks()
        const interval = setInterval(fetchStocks, 15000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (stocks.length > 0 && isInitialized) {
            setWatchlistData(watchlist.map(symbol =>
                stocks.find(s => s.symbol === symbol) || { symbol, name: 'Loading...', lastPrice: 0, changePercent: 0 }))
        }
    }, [watchlist, stocks, isInitialized])

    const fetchStocks = async () => {
        try { setStocks(await marketService.getStocks() || []) }
        catch (error) { console.error('Error fetching stocks:', error) }
        finally { setLoading(false) }
    }

    const persist = async (next) => {
        if (!isInitialized) return
        if (user) { try { await authService.updateWatchlist(next) } catch (e) { console.error(e) } }
        else localStorage.setItem('nepse_watchlist_guest', JSON.stringify(next))
    }

    const addToWatchlist = async (symbol) => {
        if (!watchlist.includes(symbol)) { const next = [...watchlist, symbol]; setWatchlist(next); await persist(next) }
        setShowSearch(false); setSearchTerm('')
    }

    const removeFromWatchlist = (symbol) => setDeleteModal({ isOpen: true, symbol })
    const confirmRemove = async () => {
        const next = watchlist.filter(s => s !== deleteModal.symbol)
        setWatchlist(next); await persist(next)
    }

    const filteredStocks = stocks.filter(s =>
        !watchlist.includes(s.symbol) && (
            s.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 8)

    if (loading) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
                <div className="h-7 w-48 bg-sunk animate-pulse rounded-[3px]" />
                <div className="h-64 panel animate-pulse" />
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-ink tracking-tight">Watchlist</h1>
                    <p className="label mt-0.5">{watchlist.length} {watchlist.length === 1 ? 'STOCK' : 'STOCKS'} TRACKED</p>
                </div>
                <button onClick={() => setShowSearch(true)} className="btn btn-accent">
                    <Plus className="h-4 w-4" /> Add Stock
                </button>
            </div>

            {watchlistData.length > 0 ? (
                <div className="panel overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="dt min-w-[560px] sm:min-w-0">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Name</th>
                                    <th className="text-right">LTP</th>
                                    <th className="text-right">%Chg</th>
                                    <th className="text-center">·</th>
                                </tr>
                            </thead>
                            <tbody>
                                {watchlistData.map((stock) => {
                                    const change = stock.changePercent || stock.percentChange || 0
                                    const price = stock.lastPrice || stock.lastTradedPrice || 0
                                    const up = change >= 0
                                    return (
                                        <tr key={stock.symbol}>
                                            <td className="font-semibold text-ink">{stock.symbol}</td>
                                            <td className="text-muted text-[12px] truncate max-w-[200px]">{stock.name || stock.securityName || '—'}</td>
                                            <td className="text-right tnum text-ink font-medium">Rs. {price.toFixed(2)}</td>
                                            <td className={`text-right tnum ${up ? 'up' : 'down'}`}>{up ? '▲' : '▼'} {up ? '+' : ''}{change.toFixed(2)}%</td>
                                            <td>
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Link to={`/stock/${stock.symbol}`} className="text-faint hover:accent transition-colors"><ArrowUpRight className="h-4 w-4" /></Link>
                                                    <button onClick={() => removeFromWatchlist(stock.symbol)} className="text-faint hover:down transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="panel py-16 text-center">
                    <Eye className="h-8 w-8 text-faint mx-auto mb-3" />
                    <p className="text-[15px] font-semibold text-ink mb-1">Your watchlist is empty</p>
                    <p className="label mb-5">Track prices without adding to your portfolio</p>
                    <button onClick={() => setShowSearch(true)} className="btn btn-accent mx-auto">
                        <Plus className="h-4 w-4" /> Add Your First Stock
                    </button>
                </div>
            )}

            {/* Search modal */}
            {showSearch && (
                <div className="fixed inset-0 bg-ink/40 flex items-start justify-center pt-24 z-50 p-4">
                    <div className="panel shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[70vh]">
                        <div className="px-3 py-2.5 border-b border-line">
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="label">ADD TO WATCHLIST</span>
                                <button onClick={() => { setShowSearch(false); setSearchTerm('') }} className="text-faint hover:text-ink transition-colors"><X className="h-4 w-4" /></button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-faint" />
                                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search symbol or company…" autoFocus className="field pl-8 py-2 font-mono text-[13px]" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {searchTerm && filteredStocks.length > 0 ? (
                                <table className="dt">
                                    <tbody>
                                        {filteredStocks.map(stock => (
                                            <tr key={stock.symbol} onClick={() => addToWatchlist(stock.symbol)} style={{ cursor: 'pointer' }}>
                                                <td className="font-semibold text-ink">{stock.symbol}</td>
                                                <td className="text-muted text-[12px] truncate">{stock.name}</td>
                                                <td className="text-right tnum text-ink">Rs. {(stock.lastPrice || stock.lastTradedPrice || 0).toFixed(2)}</td>
                                                <td className="text-center"><Plus className="h-4 w-4 text-faint inline" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-10 label">{searchTerm ? `NO RESULTS FOR "${searchTerm}"` : 'TYPE TO SEARCH'}</div>
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
                message={`Remove ${deleteModal.symbol} from your watchlist?`}
                confirmText="Remove"
            />
        </div>
    )
}

export default Watchlist
