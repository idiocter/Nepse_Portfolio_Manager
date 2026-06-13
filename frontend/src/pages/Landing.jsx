import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import marketService from '../services/marketService'
import {
    TrendingUp, TrendingDown, ArrowRight, ArrowUpRight,
    PieChart, Eye, Activity, LineChart, Shield, BarChart3
} from 'lucide-react'

const Landing = () => {
    const [gainers, setGainers] = useState([])
    const [losers, setLosers] = useState([])

    useEffect(() => {
        (async () => {
            const [g, l] = await Promise.all([
                marketService.getGainers().catch(() => ([])),
                marketService.getLosers().catch(() => ([]))
            ])
            setGainers(g?.slice(0, 6) || [])
            setLosers(l?.slice(0, 6) || [])
        })()
    }, [])

    const tape = [...gainers, ...losers]

    const features = [
        { icon: <PieChart className="h-4 w-4" />, title: 'Portfolio Ledger', description: 'Every NEPSE holding with live mark-to-market P&L, cost basis and weight.' },
        { icon: <Activity className="h-4 w-4" />, title: 'Live Tape', description: 'Streaming last-traded prices, indices and turnover through the session.' },
        { icon: <LineChart className="h-4 w-4" />, title: 'Candles + EMAs', description: 'Interactive OHLC charts with EMA overlays and volume histogram.' },
        { icon: <TrendingUp className="h-4 w-4" />, title: 'Movers Scan', description: 'Top gainers and losers ranked in real time across all sectors.' },
        { icon: <Eye className="h-4 w-4" />, title: 'Watch Sheet', description: 'Track names you do not own yet without cluttering your book.' },
        { icon: <Shield className="h-4 w-4" />, title: 'Secured Access', description: 'Google OAuth 2.0 and encrypted sessions on every request.' },
    ]

    const stats = [
        { k: 'SECURITIES', v: '250+' },
        { k: 'REFRESH', v: '10s' },
        { k: 'USERS', v: '2,500+' },
        { k: 'TRACKED', v: 'Rs.50Cr+' },
    ]

    return (
        <div>
            {/* Live tape */}
            <div className="bg-ink text-paper overflow-hidden border-b border-ink">
                <div className="max-w-[1400px] mx-auto relative">
                    {tape.length > 0 ? (
                        <div className="flex whitespace-nowrap animate-ticker">
                            {[...tape, ...tape].map((s, i) => {
                                const up = (s.changePercent || 0) >= 0
                                return (
                                    <span key={i} className="inline-flex items-center gap-2 px-4 py-1.5 text-[12px] font-mono border-r border-paper/10">
                                        <span className="font-semibold">{s.symbol}</span>
                                        <span className="text-paper/60 tnum">{s.lastPrice?.toFixed(2)}</span>
                                        <span className={up ? 'text-[var(--color-up)]' : 'text-[var(--color-down)]'}>
                                            {up ? '▲' : '▼'}{Math.abs(s.changePercent || 0).toFixed(2)}%
                                        </span>
                                    </span>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="px-4 py-1.5 text-[12px] font-mono text-paper/40">CONNECTING TO MARKET FEED…</div>
                    )}
                </div>
            </div>

            {/* Hero */}
            <section className="max-w-[1400px] mx-auto px-4 pt-14 pb-12 border-b border-line">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7">
                        <p className="label mb-4">NEPSE · PORTFOLIO TERMINAL</p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.05]">
                            Run your NEPSE book<br />like a <span className="accent">trading desk.</span>
                        </h1>
                        <p className="mt-5 text-[15px] text-muted max-w-xl leading-relaxed">
                            Real-time prices, mark-to-market P&L, candlestick charts and sector indices —
                            in one dense, no-nonsense workspace built for Nepalese investors.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Link to="/register" className="btn btn-accent text-[13px] px-5 py-2.5 no-underline">
                                Open Terminal <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link to="/market" className="btn btn-ghost text-[13px] px-5 py-2.5 no-underline">
                                <BarChart3 className="h-4 w-4" /> Browse Market
                            </Link>
                        </div>

                        <div className="mt-9 grid grid-cols-4 border-y border-line divide-x divide-[var(--color-line)]">
                            {stats.map(s => (
                                <div key={s.k} className="py-3 px-2 first:pl-0">
                                    <p className="tnum text-xl sm:text-2xl text-ink">{s.v}</p>
                                    <p className="label mt-0.5">{s.k}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Movers panel */}
                    <div className="lg:col-span-5">
                        <div className="panel overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 bg-sunk border-b border-line">
                                <span className="label">TOP MOVERS</span>
                                <span className="flex items-center gap-1.5 label">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-up)] animate-blink" /> LIVE
                                </span>
                            </div>
                            <table className="dt">
                                <thead>
                                    <tr><th>Symbol</th><th className="text-right">LTP</th><th className="text-right">%Chg</th></tr>
                                </thead>
                                <tbody>
                                    {(tape.length ? tape.slice(0, 8) : Array.from({ length: 6 })).map((s, i) => {
                                        if (!s) return <tr key={i}><td colSpan={3} className="h-8" /></tr>
                                        const up = (s.changePercent || 0) >= 0
                                        return (
                                            <tr key={i}>
                                                <td className="font-semibold">{s.symbol}</td>
                                                <td className="text-right tnum">{s.lastPrice?.toFixed(2)}</td>
                                                <td className={`text-right tnum ${up ? 'up' : 'down'}`}>
                                                    {up ? '+' : ''}{(s.changePercent || 0).toFixed(2)}%
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-[1400px] mx-auto px-4 py-12 border-b border-line">
                <div className="flex items-end justify-between mb-6">
                    <h2 className="text-2xl font-bold text-ink tracking-tight">Everything on one screen</h2>
                    <span className="label hidden sm:block">06 MODULES</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-line">
                    {features.map((f, i) => (
                        <div key={f.title} className="border-r border-b border-line p-5 hover:bg-sunk transition-colors">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="accent">{f.icon}</span>
                                <span className="label">{String(i + 1).padStart(2, '0')}</span>
                            </div>
                            <h3 className="text-[15px] font-semibold text-ink mb-1.5">{f.title}</h3>
                            <p className="text-[13px] text-muted leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Gainers / Losers split */}
            {gainers.length > 0 && (
                <section className="max-w-[1400px] mx-auto px-4 py-12 border-b border-line">
                    <h2 className="text-2xl font-bold text-ink tracking-tight mb-6">Today's session</h2>
                    <div className="grid lg:grid-cols-2 gap-px bg-line border border-line">
                        {[{ t: 'GAINERS', d: gainers, up: true }, { t: 'LOSERS', d: losers, up: false }].map(col => (
                            <div key={col.t} className="bg-panel">
                                <div className="flex items-center gap-2 px-3 py-2 bg-sunk border-b border-line">
                                    {col.up ? <TrendingUp className="h-3.5 w-3.5 up" /> : <TrendingDown className="h-3.5 w-3.5 down" />}
                                    <span className="label">TOP {col.t}</span>
                                </div>
                                <table className="dt">
                                    <tbody>
                                        {col.d.map((s, i) => {
                                            const up = (s.changePercent || 0) >= 0
                                            return (
                                                <tr key={s.symbol}>
                                                    <td className="text-faint tnum w-8">{i + 1}</td>
                                                    <td className="font-semibold">{s.symbol}</td>
                                                    <td className="text-muted text-[12px] truncate max-w-[160px]">{s.name}</td>
                                                    <td className="text-right tnum">{s.lastPrice?.toFixed(2)}</td>
                                                    <td className={`text-right tnum ${up ? 'up' : 'down'}`}>{up ? '+' : ''}{(s.changePercent || 0).toFixed(2)}%</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Link to="/market" className="btn btn-ghost no-underline">
                            Full market <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="bg-ink text-paper">
                <div className="max-w-[1400px] mx-auto px-4 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Start tracking in under a minute.</h2>
                        <p className="mt-2 text-paper/60 text-[15px]">Free to use. No card. Your book stays private.</p>
                    </div>
                    <Link to="/register" className="btn btn-accent text-[14px] px-6 py-3 no-underline shrink-0">
                        Open Terminal <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-panel border border-line p-0.5 rounded-[2px] flex items-center justify-center">
                        <img src="/favicon.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[13px] font-semibold text-ink">NEPSE·TERM</span>
                </div>
                <div className="flex items-center gap-5">
                    <Link to="/market" className="label hover:text-ink no-underline">MARKET</Link>
                    <Link to="/login" className="label hover:text-ink no-underline">LOGIN</Link>
                    <Link to="/register" className="label hover:text-ink no-underline">REGISTER</Link>
                </div>
                <p className="label">© {new Date().getFullYear()} NEPSE TERMINAL</p>
            </footer>
        </div>
    )
}

export default Landing
