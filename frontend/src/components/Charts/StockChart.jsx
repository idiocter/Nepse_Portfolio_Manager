import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, CrosshairMode, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts'
import { Activity, BarChart3, TrendingUp, Zap, Layers } from 'lucide-react'

const StockChart = ({ data, symbol }) => {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef({})

  const [showVolume, setShowVolume] = useState(true)
  const [showEMA20, setShowEMA20] = useState(true)
  const [showEMA50, setShowEMA50] = useState(true)

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#09090b' }, // zinc-950
        textColor: '#a1a1aa', // zinc-400
        fontSize: 10, // Smaller font for mobile
        fontFamily: 'Instrument Sans, Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(39, 39, 42, 0.3)' }, // zinc-800
        horzLines: { color: 'rgba(39, 39, 42, 0.3)' }, // zinc-800
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
        tickMarkFormatter: (time) => {
          // Shorter date format for mobile
          const date = new Date(time);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        },
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

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981', // emerald-500
      downColor: '#f43f5e', // rose-500
      borderUpColor: '#10b981',
      borderDownColor: '#f43f5e',
      wickUpColor: '#10b981',
      wickDownColor: '#f43f5e',
    })

    const ema20Series = chart.addSeries(LineSeries, {
      color: '#3b82f6', // blue-500
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: false,
      title: 'EMA 20',
      visible: showEMA20
    });

    const ema50Series = chart.addSeries(LineSeries, {
      color: '#8b5cf6', // violet-500
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: false,
      title: 'EMA 50',
      visible: showEMA50
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#27272a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // overlay
      visible: showVolume
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
      color: item.close >= item.open ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)',
    }))

    // Calculate EMAs
    const calculateEMA = (data, period) => {
      const k = 2 / (period + 1);
      let ema = data[0].close;
      const emaData = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          ema = (ema * i + data[i].close) / (i + 1); // Simple mean until period reached
        } else {
          ema = data[i].close * k + ema * (1 - k);
          emaData.push({ time: data[i].date, value: ema });
        }
      }
      return emaData;
    };

    if (data.length >= 20) {
      ema20Series.setData(calculateEMA(data, 20));
    }
    if (data.length >= 50) {
      ema50Series.setData(calculateEMA(data, 50));
    }

    candlestickSeries.setData(formattedData)
    volumeSeries.setData(volumeData)

    chart.timeScale().fitContent()
    chartRef.current = chart
    seriesRef.current = { candlestickSeries, volumeSeries, ema20Series, ema50Series }

    const handleResize = () => {
      if (chartContainerRef.current) {
        const { clientWidth, clientHeight } = chartContainerRef.current;
        chart.applyOptions({
          width: clientWidth,
          height: clientHeight,
        });
        // Adjust font size based on screen width
        const fontSize = clientWidth < 640 ? 10 : 12;
        chart.applyOptions({
          layout: { fontSize }
        });
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

  // Single effect to handle visibility toggles without full re-render of chart object
  useEffect(() => {
    if (seriesRef.current.volumeSeries) {
      seriesRef.current.volumeSeries.applyOptions({ visible: showVolume })
    }
    if (seriesRef.current.ema20Series) {
      seriesRef.current.ema20Series.applyOptions({ visible: showEMA20 })
    }
    if (seriesRef.current.ema50Series) {
      seriesRef.current.ema50Series.applyOptions({ visible: showEMA50 })
    }
  }, [showVolume, showEMA20, showEMA50])

  return (
    <div className="bg-zinc-950 rounded-2xl sm:rounded-[32px] p-1.5 sm:p-2 h-full flex flex-col overflow-hidden border border-zinc-800 shadow-2xl relative">
      {/* Chart Header / Toolbar - Responsive layout */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 lg:py-4 border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm z-10 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <h3 className="text-[10px] sm:text-[11px] lg:text-xs font-black text-zinc-500 uppercase tracking-wider sm:tracking-[0.2em]">
            {symbol} <span className="text-zinc-700 mx-1 sm:mx-2">/</span> <span className="hidden sm:inline">MARKET PRO</span>
          </h3>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
        </div>

        {/* Options Toolbar - Wrap on mobile */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 lg:gap-2">
          <button
            onClick={() => setShowEMA20(!showEMA20)}
            className={`px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 sm:gap-1.5 ${showEMA20 ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
          >
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> <span className="hidden xs:inline">EMA</span> 20
          </button>
          <button
            onClick={() => setShowEMA50(!showEMA50)}
            className={`px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 sm:gap-1.5 ${showEMA50 ? 'bg-violet-500/10 border-violet-500/50 text-violet-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
          >
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> <span className="hidden xs:inline">EMA</span> 50
          </button>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 sm:gap-1.5 ${showVolume ? 'bg-zinc-100 border-zinc-200 text-zinc-900' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
          >
            <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> <span className="hidden sm:inline">Vol</span>
          </button>
          <div className="h-3 w-px bg-zinc-800 mx-1 hidden sm:block" />
          <div className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-zinc-900 rounded-md sm:rounded-lg border border-zinc-800 flex items-center gap-1 sm:gap-1.5">
            <Activity className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
            <span className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase tracking-wider">D1</span>
          </div>
        </div>
      </div>

      {/* Main Chart Area - Responsive min height */}
      <div ref={chartContainerRef} className="w-full flex-grow relative min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]" />

      {/* Chart Footer - Responsive padding and text */}
      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 border-t border-zinc-800/50 bg-zinc-950 flex justify-between items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <p className="text-[9px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-wider">TV v4.0</p>
          <span className="text-[9px] sm:text-[10px] font-bold text-zinc-800 hidden sm:inline">|</span>
          <p className="text-[9px] sm:text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{data.length} Pts</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 rounded-[2px] bg-emerald-500/20 border border-emerald-500/50" />
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Bull</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            <div className="w-2 h-2 rounded-[2px] bg-rose-500/20 border border-rose-500/50" />
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">Bear</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default StockChart