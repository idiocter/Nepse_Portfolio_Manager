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
            color: 'bg-neutral-100 text-neutral-700'
        },
        {
            icon: <Activity className="h-7 w-7" />,
            title: 'Live Market Data',
            description: 'Get real-time stock prices, market indices, and trading volumes during market hours.',
            color: 'bg-neutral-100 text-neutral-700'
        },
        {
            icon: <LineChart className="h-7 w-7" />,
            title: 'Price Charts',
            description: 'Interactive candlestick charts with historical price data for informed decisions.',
            color: 'bg-neutral-100 text-neutral-700'
        },
        {
            icon: <TrendingUp className="h-7 w-7" />,
            title: 'Top Movers',
            description: 'Track top gainers and losers in real-time to spot market opportunities.',
            color: 'bg-neutral-100 text-neutral-700'
        },
        {
            icon: <Eye className="h-7 w-7" />,
            title: 'Watchlist',
            description: 'Monitor stocks you\'re interested in without adding them to your portfolio.',
            color: 'bg-neutral-100 text-neutral-700'
        },
        {
            icon: <Shield className="h-7 w-7" />,
            title: 'Secure & Private',
            description: 'Your portfolio data is encrypted and protected with Google OAuth authentication.',
            color: 'bg-neutral-100 text-neutral-700'
        }
    ]

    const stats = [
        { label: 'Active Users', value: '2,500+', icon: <Globe className="h-5 w-5" /> },
        { label: 'Stocks Tracked', value: '250+', icon: <BarChart3 className="h-5 w-5" /> },
        { label: 'Real-time Updates', value: '10s', icon: <Zap className="h-5 w-5" /> },
        { label: 'Portfolio Value Tracked', value: 'Rs. 50Cr+', icon: <Wallet className="h-5 w-5" /> },
    ]

    return (
        <div className="bg-white selection:bg-zinc-200">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-32 overflow-hidden">
                {/* Background decoration - subtle neutral blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-zinc-50 rounded-full blur-[120px] opacity-60 animate-float" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neutral-100 rounded-full blur-[100px] opacity-40 animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="animate-fade-in-up stagger-1 mb-8">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold tracking-widest uppercase">
                                🚀 Premium Portfolio Tracker for Nepal
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-zinc-900 mb-8 leading-[1.05] tracking-tight animate-fade-in-up stagger-2">
                            Master Your <span className="text-zinc-600">NEPSE</span><br />
                            Assets With Precision.
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-500 mb-14 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in-up stagger-3">
                            A sophisticated, real-time analytics platform designed for the modern Nepalese investor.
                            Track holdings, analyze trends, and grow your wealth with confidence.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up stagger-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-200 no-underline flex items-center justify-center gap-3"
                            >
                                Get Started Free
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                to="/market"
                                className="w-full sm:w-auto px-10 py-5 bg-white border border-zinc-200 text-zinc-700 rounded-2xl font-bold text-lg hover:bg-zinc-50 hover:border-zinc-300 hover:scale-[1.02] active:scale-[0.98] transition-all no-underline flex items-center justify-center gap-3"
                            >
                                <BarChart3 className="h-5 w-5" />
                                Explore Market
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Market Ticker */}
            {(gainers.length > 0 || losers.length > 0) && (
                <section className="py-6 border-y border-zinc-100 bg-zinc-50/50">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center gap-8 overflow-x-auto py-2 no-scrollbar">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] whitespace-nowrap flex items-center gap-2">
                                <Activity className="h-3 w-3" />
                                Market Live
                            </span>
                            {gainers.slice(0, 3).map(stock => (
                                <div key={stock.symbol} className="flex items-center gap-3 whitespace-nowrap text-sm">
                                    <span className="font-bold text-zinc-900">{stock.symbol}</span>
                                    <span className="text-zinc-500 font-medium">Rs. {stock.lastPrice?.toFixed(2)}</span>
                                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                        <TrendingUp className="h-3 w-3" />
                                        +{stock.changePercent?.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                            {losers.slice(0, 3).map(stock => (
                                <div key={stock.symbol} className="flex items-center gap-3 whitespace-nowrap text-sm">
                                    <span className="font-bold text-zinc-900">{stock.symbol}</span>
                                    <span className="text-zinc-500 font-medium">Rs. {stock.lastPrice?.toFixed(2)}</span>
                                    <span className="text-rose-600 font-bold flex items-center gap-0.5">
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
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm text-center animate-fade-in-up stagger-${index + 1}`}
                            >
                                <div className="flex items-center justify-center mb-4 text-zinc-400">
                                    {stat.icon}
                                </div>
                                <p className="text-3xl md:text-4xl font-black text-zinc-900 mb-2 tracking-tighter">{stat.value}</p>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tight">
                            Everything to <span className="text-zinc-500">Invest Smarter.</span>
                        </h2>
                        <p className="text-zinc-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                            Sophisticated tools and real-time insights to help you manage your NEPSE portfolio with unparalleled clarity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className={`p-10 rounded-3xl border border-zinc-100 bg-zinc-50/30 hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-500 animate-fade-in-up stagger-${index + 1}`}
                            >
                                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-zinc-500 leading-relaxed text-lg font-medium">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Market Preview */}
            {gainers.length > 0 && (
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-6 tracking-tight">
                                Today's <span className="text-zinc-500">Market Dynamics.</span>
                            </h2>
                            <p className="text-zinc-500 text-lg font-medium">Real-time performance of NEPSE's active securities.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Top Gainers */}
                            <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-40 -mr-10 -mt-10" />
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900">Top Gainers</h3>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    {gainers.map((stock, i) => (
                                        <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-black text-zinc-300 w-4">{i + 1}</span>
                                                <div>
                                                    <p className="font-bold text-zinc-900">{stock.symbol}</p>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate max-w-[150px]">{stock.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-zinc-900">Rs. {stock.lastPrice?.toFixed(2)}</p>
                                                <p className="text-sm font-black text-emerald-600">+{stock.changePercent?.toFixed(2)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Losers */}
                            <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-40 -mr-10 -mt-10" />
                                <div className="flex items-center gap-3 mb-8 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                                        <TrendingDown className="h-5 w-5 text-rose-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900">Top Losers</h3>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    {losers.map((stock, i) => (
                                        <div key={stock.symbol} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-black text-zinc-300 w-4">{i + 1}</span>
                                                <div>
                                                    <p className="font-bold text-zinc-900">{stock.symbol}</p>
                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate max-w-[150px]">{stock.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-zinc-900">Rs. {stock.lastPrice?.toFixed(2)}</p>
                                                <p className="text-sm font-black text-rose-600">{stock.changePercent?.toFixed(2)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/market" className="px-8 py-3.5 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-all no-underline inline-flex items-center gap-3">
                                View Full Market
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-48 px-6 bg-zinc-950">
                <div className="container mx-auto">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
                            Ready to Master Your <br />
                            <span className="text-zinc-500">Financial Future?</span>
                        </h2>
                        <p className="text-zinc-400 text-xl md:text-2xl mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
                            Join the elite circle of Nepalese investors who trade with data-backed precision.
                        </p>
                        <Link
                            to="/register"
                            className="px-12 py-6 bg-white text-zinc-950 rounded-2xl font-black text-xl hover:bg-zinc-100 hover:scale-[1.05] active:scale-[0.95] transition-all no-underline inline-flex items-center gap-4 shadow-2xl shadow-white/10"
                        >
                            Get Started Free
                            <ArrowRight className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-24 border-t border-zinc-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-black text-zinc-900 tracking-tighter">NEPSE Tracker</span>
                        </div>
                        <div className="flex items-center gap-10">
                            <Link to="/market" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors no-underline uppercase tracking-widest">Market</Link>
                            <Link to="/login" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors no-underline uppercase tracking-widest">Login</Link>
                            <Link to="/register" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors no-underline uppercase tracking-widest">Register</Link>
                        </div>
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                            © {new Date().getFullYear()} NEPSE Tracker. Digital precision.
                        </p>
                    </div>
                </div>
            </footer>
        </div >
    )
}

export default Landing
