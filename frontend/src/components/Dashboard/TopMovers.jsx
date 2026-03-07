import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, TrendingDown } from 'lucide-react'

const TopMovers = () => {
  const [gainers, setGainers] = useState([])
  const [losers, setLosers] = useState([])
  const [activeTab, setActiveTab] = useState('gainers')

  useEffect(() => {
    fetchMovers()
    const interval = setInterval(fetchMovers, 30000) // Refresh every 30s
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
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab('gainers')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'gainers' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Top Gainers</span>
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'losers' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          <span>Top Losers</span>
        </button>
      </div>

      <div className="space-y-3">
        {data.map((stock, index) => (
          <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
              <div>
                <p className="font-medium">{stock.symbol}</p>
                <p className="text-xs text-gray-500">{stock.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">Rs. {stock.lastPrice?.toFixed(2)}</p>
              <p className={`text-sm ${isGainers ? 'text-green-600' : 'text-red-600'}`}>
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