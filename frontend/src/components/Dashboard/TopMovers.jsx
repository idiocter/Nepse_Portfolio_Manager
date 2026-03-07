import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, TrendingDown } from 'lucide-react'

const TopMovers = () => {
  const [gainers, setGainers] = useState([])
  const [losers, setLosers] = useState([])
  const [activeTab, setActiveTab] = useState('gainers')

  useEffect(() => {
    fetchMovers()
    const interval = setInterval(fetchMovers, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMovers = async () => {
    try {
      const [gainersRes, losersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/market/gainers`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/market/losers`)
      ])
      setGainers(gainersRes.data)
      setLosers(losersRes.data)
    } catch (error) {
      console.error('Error fetching movers:', error)
    }
  }

  const data = activeTab === 'gainers' ? gainers : losers
  const isGainers = activeTab === 'gainers'

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('gainers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'gainers' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
        >
          <TrendingUp className="h-4 w-4" />
          Gainers
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'losers' ? 'bg-rose-50 text-rose-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
        >
          <TrendingDown className="h-4 w-4" />
          Losers
        </button>
      </div>

      <div className="space-y-4">
        {data.map((stock, index) => (
          <div key={stock.symbol} className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-2xl hover:bg-zinc-100/50 transition-all border border-transparent hover:border-zinc-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-black text-zinc-300 w-5">{index + 1}</span>
              <div>
                <p className="font-black text-zinc-900 tracking-tight">{stock.symbol}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate max-w-[120px]">{stock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-zinc-900 tabular-nums">Rs. {stock.lastPrice?.toFixed(2)}</p>
              <p className={`text-sm font-black tabular-nums ${isGainers ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isGainers ? '+' : ''}{stock.changePercent?.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-xs font-black text-zinc-300 uppercase tracking-widest">No market data</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopMovers