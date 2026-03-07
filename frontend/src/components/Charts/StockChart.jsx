import { useEffect, useRef } from 'react'
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts'

const StockChart = ({ data, symbol }) => {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#09090b' }, // zinc-950
        textColor: '#a1a1aa', // zinc-400
        fontSize: 12,
        fontFamily: 'Instrument Sans, Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(39, 39, 42, 0.5)' }, // zinc-800
        horzLines: { color: 'rgba(39, 39, 42, 0.5)' }, // zinc-800
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#52525b',
          width: 1,
          style: 3,
          labelBackgroundColor: '#18181b'
        },
        horzLine: {
          color: '#52525b',
          width: 1,
          style: 3,
          labelBackgroundColor: '#18181b'
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(39, 39, 42, 0.8)',
        textColor: '#a1a1aa',
        scaleMargins: {
          top: 0.1,
          bottom: 0.25,
        },
      },
      timeScale: {
        borderColor: 'rgba(39, 39, 42, 0.8)',
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

    const volumeSeries = chart.addHistogramSeries({
      color: '#27272a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // overlay
    })

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    })

    const formattedData = data.map(item => ({
      time: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }))

    const volumeData = data.map(item => ({
      time: item.date,
      value: item.volume,
      color: item.close >= item.open ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
    }))

    candlestickSeries.setData(formattedData)
    volumeSeries.setData(volumeData)

    chart.timeScale().fitContent()
    chartRef.current = chart

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })

    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [data])

  return (
    <div className="bg-zinc-950 rounded-[32px] p-2 h-full flex flex-col overflow-hidden border border-zinc-800 shadow-2xl">
      <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">{symbol} <span className="text-zinc-700 mx-2">/</span> MARKET PRO</h3>
          <div className="flex gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Execution</span>
            <span className="text-[10px] font-black text-emerald-500 uppercase tabular-nums">Realtime</span>
          </div>
          <div className="px-3 py-1 bg-zinc-900 rounded-lg border border-zinc-800">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">D1</span>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full flex-grow relative" />
      <div className="px-6 py-3 border-t border-zinc-800/50 bg-zinc-950 flex justify-between items-center">
        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">TradingView Engine v4.0</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-[2px] bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Bullish Intensity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-[2px] bg-rose-500/20 border border-rose-500/50" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Bearish Pressure</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockChart