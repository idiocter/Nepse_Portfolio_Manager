import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
    TrendingUp, TrendingDown, Search, BarChart3,
    Activity, ArrowUpRight, RefreshCw, Filter
} from 'lucide-react'

const Market = () => {
    const [stocks, setStocks] = useState([])
    const [gainers, setGainers] = useState([])
    const [losers, setLosers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('all')
    const [loading, setLoading] = useState(true)
    const [sortConfig, setSortConfig] = useState({ key: 'symbol', direction: 'asc' })

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    const fetchData = async () => {
        try {
            const [stocksRes, gainersRes, losersRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/market/stocks`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/market/gainers`),
                axios.get(`${import.meta.env.VITE_API_URL}/api/market/losers`)
            ])
            setStocks(stocksRes.data || [])
            setGainers(gainersRes.data || [])
            setLosers(losersRes.data || [])
        } catch (error) {
            console.error('Error fetching market data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
    }

    const getDisplayStocks = () => {
        let data = activeTab === 'gainers' ? gainers : activeTab === 'losers' ? losers : stocks
        if (searchTerm) {
            data = data.filter(s =>
                s.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key] ?? 0
            const bVal = b[sortConfig.key] ?? 0
            if (typeof aVal === 'string') return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
            return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
        })
    }

    const tabs = [
        { id: 'all', label: 'All Stocks', icon: <BarChart3 className="h-4 w-4" /> },
        { id: 'gainers', label: 'Top Gainers', icon: <TrendingUp className="h-4 w-4" /> },
        { id: 'losers', label: 'Top Losers', icon: <TrendingDown className="h-4 w-4" /> },
    ]

    const displayStocks = getDisplayStocks()

    if (loading) {
        return (
            <div className="page-enter space-y-6">
                <div className="skeleton h-8 w-48 mb-2" />
                <div className="card">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100">
                            <div className="skeleton h-5 w-24" />
                            <div className="skeleton h-5 w-20" />
                            <div className="skeleton h-5 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="page-enter space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Activity className="h-7 w-7 text-primary-600" />
                        Market Overview
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Real-time data from Nepal Stock Exchange · {stocks.length} stocks listed
                    </p>
                </div>
                <button onClick={fetchData} className="btn-secondary flex items-center gap-2 self-start">
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white text-primary-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search stocks..." className="input pl-10 py-2.5 text-sm" />
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
                <Filter className="h-3.5 w-3.5" />
                <span>Showing {displayStocks.length} stocks</span>
            </div>

            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="cursor-pointer hover:text-primary-600" onClick={() => handleSort('symbol')}>
                                    Symbol {sortConfig.key === 'symbol' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="hidden md:table-cell">Name</th>
                                <th className="text-right cursor-pointer hover:text-primary-600" onClick={() => handleSort('lastPrice')}>
                                    LTP {sortConfig.key === 'lastPrice' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="text-right cursor-pointer hover:text-primary-600" onClick={() => handleSort('changePercent')}>
                                    Change {sortConfig.key === 'changePercent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="text-right hidden lg:table-cell">Volume</th>
                                <th className="text-right hidden lg:table-cell">High</th>
                                <th className="text-right hidden lg:table-cell">Low</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayStocks.map((stock) => {
                                const isPositive = (stock.changePercent || 0) >= 0
                                return (
                                    <tr key={stock.symbol}>
                                        <td className="font-medium text-gray-900">{stock.symbol}</td>
                                        <td className="hidden md:table-cell text-gray-500 text-xs max-w-[200px] truncate">
                                            {stock.name || stock.securityName || '—'}
                                        </td>
                                        <td className="text-right font-medium">Rs. {(stock.lastPrice || stock.lastTradedPrice || 0).toFixed(2)}</td>
                                        <td className="text-right">
                                            <span className={`badge ${isPositive ? 'badge-success' : 'badge-danger'}`}>
                                                {isPositive ? '+' : ''}{(stock.changePercent || stock.percentChange || 0).toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="text-right hidden lg:table-cell text-gray-500">
                                            {(stock.volume || stock.totalTradedQuantity || 0).toLocaleString()}
                                        </td>
                                        <td className="text-right hidden lg:table-cell text-gray-500">{(stock.highPrice || stock.high || 0).toFixed(2)}</td>
                                        <td className="text-right hidden lg:table-cell text-gray-500">{(stock.lowPrice || stock.low || 0).toFixed(2)}</td>
                                        <td className="text-center">
                                            <Link to={`/stock/${stock.symbol}`}
                                                className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                                                Details <ArrowUpRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {displayStocks.length === 0 && (
                    <div className="text-center py-16">
                        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No stocks found</p>
                        <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Market
