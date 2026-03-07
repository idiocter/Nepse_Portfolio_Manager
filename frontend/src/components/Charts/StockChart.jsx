import { useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'

const StockChart = ({ data, symbol }) => {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#a1a1aa', // zinc-400
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: '#f4f4f5' }, // zinc-100
        horzLines: { color: '#f4f4f5' }, // zinc-100
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#18181b', width: 1, style: 2 },
        horzLine: { color: '#18181b', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: '#f4f4f5',
        textColor: '#a1a1aa',
      },
      timeScale: {
        borderColor: '#f4f4f5',
        timeVisible: true,
        textColor: '#a1a1aa',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      }
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981', // emerald-500
      downColor: '#f43f5e', // rose-500
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    })

    const formattedData = data.map(item => ({
      time: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }))

    candlestickSeries.setData(formattedData)
    chart.timeScale().fitContent()

    chartRef.current = chart

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: 480,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [data])

  return (
    <div className="bg-white rounded-[32px] p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-[0.3em]">{symbol} / Market Analytics</h3>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Live Execution</span>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full flex-grow rounded-2xl overflow-hidden" />
    </div>
  )
}

export default StockChart