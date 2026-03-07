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
    <div className="card">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('gainers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'gainers' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
        >
          <TrendingUp className="h-4 w-4" />
          Top Gainers
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'losers' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
        >
          <TrendingDown className="h-4 w-4" />
          Top Losers
        </button>
      </div>

      <div className="space-y-3">
        {data.map((stock, index) => (
          <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-400 w-6">{index + 1}</span>
              <div>
                <p className="font-medium text-gray-900">{stock.symbol}</p>
                <p className="text-xs text-gray-400">{stock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Rs. {stock.lastPrice?.toFixed(2)}</p>
              <p className={`text-sm font-semibold ${isGainers ? 'text-green-600' : 'text-red-600'}`}>
                {isGainers ? '+' : ''}{stock.changePercent?.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopMovers