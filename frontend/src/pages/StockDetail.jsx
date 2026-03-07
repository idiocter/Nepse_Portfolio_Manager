import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react'
import StockChart from '../components/Charts/StockChart'

const StockDetail = () => {
  const { symbol } = useParams()
  const [details, setDetails] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStockData()
  }, [symbol])

  const fetchStockData = async () => {
    try {
      const [detailsRes, historyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/market/stock/${symbol}`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/market/history/${symbol}`)
      ])
      setDetails(detailsRes.data)
      setHistory(historyRes.data)
    } catch (error) {
      console.error('Error fetching stock data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const isPositive = details?.change >= 0

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600">
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{symbol}</h1>
            <p className="text-gray-500 mt-1">{details?.securityName}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-3xl font-bold">Rs. {details?.lastTradedPrice?.toFixed(2)}</p>
            <div className={`flex items-center justify-end space-x-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span className="text-lg font-medium">
                {isPositive ? '+' : ''}{details?.change?.toFixed(2)} ({details?.percentChange?.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Open</span>
          </div>
          <p className="text-xl font-semibold">Rs. {details?.openPrice?.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">High</span>
          </div>
          <p className="text-xl font-semibold">Rs. {details?.highPrice?.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <TrendingDown className="h-4 w-4" />
            <span className="text-sm">Low</span>
          </div>
          <p className="text-xl font-semibold">Rs. {details?.lowPrice?.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Volume</span>
          </div>
          <p className="text-xl font-semibold">{details?.totalTradedQuantity?.toLocaleString()}</p>
        </div>
      </div>

      <StockChart data={history} symbol={symbol} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Trading Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Previous Close</span>
              <span className="font-medium">Rs. {details?.previousClose?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">52 Week High</span>
              <span className="font-medium">Rs. {details?.fiftyTwoWeekHigh?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">52 Week Low</span>
              <span className="font-medium">Rs. {details?.fiftyTwoWeekLow?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Average Price</span>
              <span className="font-medium">Rs. {details?.averageTradedPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Market Data</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Market Cap</span>
              <span className="font-medium">{details?.marketCapitalization?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Shares Outstanding</span>
              <span className="font-medium">{details?.outstandingShares?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Sector</span>
              <span className="font-medium">{details?.sectorName}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium">{new Date(details?.lastUpdatedDate).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockDetail