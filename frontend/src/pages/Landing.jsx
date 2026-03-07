import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
    TrendingUp, TrendingDown, BarChart3, Shield, Zap,
    PieChart, Eye, ArrowRight, Activity, LineChart,
    Wallet, Globe, ChevronRight
} from 'lucide-react'

const Landing = () => {
    const [gainers, setGainers] = useState([])
    const [losers, setLosers] = useState([])

    useEffect(() => {
        fetchMarketData()
    }, [])

    const fetchMarketData = async () => {
        try {
            const [gainersRes, losersRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/market/gainers`).catch(() => ({ data: [] })),
                axios.get(`${import.meta.env.VITE_API_URL}/api/market/losers`).catch(() => ({ data: [] }))
            ])
            setGainers(gainersRes.data?.slice(0, 5) || [])
            setLosers(losersRes.data?.slice(0, 5) || [])
        } catch (error) {
            console.error('Error fetching market data:', error)
        }
    }

    const features = [
        {
            icon: <PieChart className="h-7 w-7" />,
            title: 'Portfolio Tracking',
            description: 'Track all your NEPSE holdings in one place with real-time profit/loss calculations.',
            color: 'bg-indigo-100 text-indigo-600'
        },
        {
            icon: <Activity className="h-7 w-7" />,
            title: 'Live Market Data',
            description: 'Get real-time stock prices, market indices, and trading volumes during market hours.',
            color: 'bg-cyan-100 text-cyan-600'
        },
        {
            icon: <LineChart className="h-7 w-7" />,
            title: 'Price Charts',
            description: 'Interactive candlestick charts with historical price data for informed decisions.',
            color: 'bg-emerald-100 text-emerald-600'
        },
        {
            icon: <TrendingUp className="h-7 w-7" />,
            title: 'Top Movers',
            description: 'Track top gainers and losers in real-time to spot market opportunities.',
            color: 'bg-amber-100 text-amber-600'
        },
        {
            icon: <Eye className="h-7 w-7" />,
            title: 'Watchlist',
            description: 'Monitor stocks you\'re interested in without adding them to your portfolio.',
            color: 'bg-pink-100 text-pink-600'
        },
        {
            icon: <Shield className="h-7 w-7" />,
            title: 'Secure & Private',
            description: 'Your portfolio data is encrypted and protected with Google OAuth authentication.',
            color: 'bg-violet-100 text-violet-600'
        }
    ]

    const stats = [
        { label: 'Active Users', value: '2,500+', icon: <Globe className="h-5 w-5" /> },
        { label: 'Stocks Tracked', value: '250+', icon: <BarChart3 className="h-5 w-5" /> },
        { label: 'Real-time Updates', value: '10s', icon: <Zap className="h-5 w-5" /> },
        { label: 'Portfolio Value Tracked', value: 'Rs. 50Cr+', icon: <Wallet className="h-5 w-5" /> },
    ]

    return (
        <div className="page-enter">
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-40 animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-fade-in-up stagger-1">
                            <span className="badge badge-primary text-sm px-4 py-1.5 mb-6 inline-block">
                                🚀 Nepal's #1 Portfolio Tracker
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight animate-fade-in-up stagger-2">
                            Track Your{' '}
                            <span className="gradient-text">NEPSE</span>
                            <br />
                            Portfolio Like a Pro
                        </h1>

                        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-3">
                            Real-time stock tracking, interactive charts, portfolio analytics —
                            everything you need to make smarter investment decisions in the Nepal Stock Exchange.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-4">
                            <Link
                                to="/register"
                                className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 no-underline"
                            >
                                Get Started Free
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                to="/market"
                                className="btn-secondary text-base px-8 py-3.5 flex items-center gap-2 no-underline"
                            >
                                <BarChart3 className="h-5 w-5" />
                                View Market
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Market Ticker */}
            {(gainers.length > 0 || losers.length > 0) && (
                <section className="py-4 border-y border-gray-200 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-6 overflow-x-auto py-2">
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider whitespace-nowrap flex items-center gap-2">
                                <Activity className="h-3.5 w-3.5" />
                                Live
                            </span>
                            {gainers.slice(0, 3).map(stock => (
                                <div key={stock.symbol} className="flex items-center gap-2 whitespace-nowrap text-sm">
                                    <span className="font-semibold text-gray-800">{stock.symbol}</span>
                                    <span className="text-gray-500">Rs. {stock.lastPrice?.toFixed(2)}</span>
                                    <span className="text-green-600 flex items-center gap-0.5">
                                        <TrendingUp className="h-3 w-3" />
                                        +{stock.changePercent?.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                            {losers.slice(0, 3).map(stock => (
                                <div key={stock.symbol} className="flex items-center gap-2 whitespace-nowrap text-sm">
                                    <span className="font-semibold text-gray-800">{stock.symbol}</span>
                                    <span className="text-gray-500">Rs. {stock.lastPrice?.toFixed(2)}</span>
                                    <span className="text-red-600 flex items-center gap-0.5">
                                        <TrendingDown className="h-3 w-3" />
                                        {stock.changePercent?.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`card stat-card text-center animate-fade-in-up stagger-${index + 1}`}
                            >
                                <div className="flex items-center justify-center mb-3 text-indigo-500">
                                    {stat.icon}
                                </div>
                                <p className="text-2xl md:text-3xl font-extrabold gradient-text mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Everything You Need to{' '}
                            <span className="gradient-text">Invest Smarter</span>
                        </h2>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Powerful tools and real-time insights to help you manage your NEPSE portfolio with confidence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className={`card group cursor-default animate-fade-in-up stagger-${index + 1}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Market Preview */}
            {gainers.length > 0 && (
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                                Today's <span className="gradient-text">Market Movers</span>
                            </h2>
                            <p className="text-gray-500">Stay updated with the hottest stocks on NEPSE</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {/* Top Gainers */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Top Gainers</h3>
                                </div>
                                <div className="space-y-3">
                                    {gainers.map((stock, i) => (
                                        <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-800">{stock.symbol}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[120px]">{stock.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-800">Rs. {stock.lastPrice?.toFixed(2)}</p>
                                                <p className="text-xs font-bold text-green-600">+{stock.changePercent?.toFixed(2)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Losers */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                        <TrendingDown className="h-4 w-4 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Top Losers</h3>
                                </div>
                                <div className="space-y-3">
                                    {losers.map((stock, i) => (
                                        <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                                                <div>
                                                    <p className="font-semibold text-sm text-gray-800">{stock.symbol}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[120px]">{stock.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-800">Rs. {stock.lastPrice?.toFixed(2)}</p>
                                                <p className="text-xs font-bold text-red-600">{stock.changePercent?.toFixed(2)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-8">
                            <Link to="/market" className="btn-secondary inline-flex items-center gap-2 no-underline">
                                View Full Market
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
                                Ready to Track Your{' '}
                                <span className="gradient-text">NEPSE Portfolio</span>?
                            </h2>
                            <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
                                Join thousands of investors who trust our platform to manage and grow their investments.
                            </p>
                            <Link
                                to="/register"
                                className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 no-underline"
                            >
                                Create Free Account
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-primary-600" />
                            <span className="text-lg font-bold text-gray-900">NEPSE Tracker</span>
                        </div>
                        <div className="flex items-center gap-8">
                            <Link to="/market" className="text-sm text-gray-500 hover:text-primary-600 transition-colors no-underline">Market</Link>
                            <Link to="/login" className="text-sm text-gray-500 hover:text-primary-600 transition-colors no-underline">Login</Link>
                            <Link to="/register" className="text-sm text-gray-500 hover:text-primary-600 transition-colors no-underline">Register</Link>
                        </div>
                        <p className="text-sm text-gray-400">
                            © {new Date().getFullYear()} NEPSE Tracker. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
