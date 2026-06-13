import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType, CrosshairMode, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts'
import { BarChart3, Zap } from 'lucide-react'

const UP = '#34d399'
const DOWN = '#f87171'
const EMA20 = '#5b7cfa'   // accent indigo
const EMA50 = '#e9ecf1'   // ink

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
        background: { type: ColorType.Solid, color: '#16191f' },
        textColor: '#9097a3',
        fontSize: 11,
        fontFamily: "'IBM Plex Mono', monospace",
      },
      grid: {
        vertLines: { color: 'rgba(36, 40, 50, 0.7)' },
        horzLines: { color: 'rgba(36, 40, 50, 0.7)' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#5b7cfa', width: 1, style: 3, labelBackgroundColor: '#1e222a' },
        horzLine: { color: '#5b7cfa', width: 1, style: 3, labelBackgroundColor: '#1e222a' },
      },
      rightPriceScale: { borderColor: '#242832', textColor: '#9097a3', scaleMargins: { top: 0.1, bottom: 0.25 } },
      timeScale: {
        borderColor: '#242832', timeVisible: true,
        tickMarkFormatter: (time) => { const d = new Date(time); return `${d.getMonth() + 1}/${d.getDate()}` },
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    })

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: UP, downColor: DOWN, borderUpColor: UP, borderDownColor: DOWN, wickUpColor: UP, wickDownColor: DOWN,
    })
    const ema20Series = chart.addSeries(LineSeries, { color: EMA20, lineWidth: 1.5, priceLineVisible: false, lastValueVisible: false, title: 'EMA 20', visible: showEMA20 })
    const ema50Series = chart.addSeries(LineSeries, { color: EMA50, lineWidth: 1.5, priceLineVisible: false, lastValueVisible: false, title: 'EMA 50', visible: showEMA50 })
    const volumeSeries = chart.addSeries(HistogramSeries, { color: '#1e222a', priceFormat: { type: 'volume' }, priceScaleId: '', visible: showVolume })
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })

    const formattedData = data.map(item => ({ time: item.date, open: item.open, high: item.high, low: item.low, close: item.close }))
    const volumeData = data.map(item => ({
      time: item.date, value: item.volume,
      color: item.close >= item.open ? 'rgba(52, 211, 153, 0.22)' : 'rgba(248, 113, 113, 0.22)',
    }))

    const calculateEMA = (data, period) => {
      const k = 2 / (period + 1)
      let ema = data[0].close
      const emaData = []
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) ema = (ema * i + data[i].close) / (i + 1)
        else { ema = data[i].close * k + ema * (1 - k); emaData.push({ time: data[i].date, value: ema }) }
      }
      return emaData
    }
    if (data.length >= 20) ema20Series.setData(calculateEMA(data, 20))
    if (data.length >= 50) ema50Series.setData(calculateEMA(data, 50))

    candlestickSeries.setData(formattedData)
    volumeSeries.setData(volumeData)
    chart.timeScale().fitContent()
    chartRef.current = chart
    seriesRef.current = { candlestickSeries, volumeSeries, ema20Series, ema50Series }

    const handleResize = () => {
      if (chartContainerRef.current) {
        const { clientWidth, clientHeight } = chartContainerRef.current
        chart.applyOptions({ width: clientWidth, height: clientHeight, layout: { fontSize: clientWidth < 640 ? 10 : 11 } })
      }
    }
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(chartContainerRef.current)

    return () => { resizeObserver.disconnect(); chart.remove() }
  }, [data])

  useEffect(() => {
    seriesRef.current.volumeSeries?.applyOptions({ visible: showVolume })
    seriesRef.current.ema20Series?.applyOptions({ visible: showEMA20 })
    seriesRef.current.ema50Series?.applyOptions({ visible: showEMA50 })
  }, [showVolume, showEMA20, showEMA50])

  const toggle = (active, color) =>
    `flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-mono uppercase tracking-wider transition-colors ${active ? 'text-paper border-transparent' : 'text-muted border-line hover:border-line-strong'}`

  return (
    <div className="panel h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-line bg-sunk gap-2">
        <span className="label">{symbol} · D1</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowEMA20(!showEMA20)} className={toggle(showEMA20)} style={showEMA20 ? { background: EMA20 } : {}}>
            <Zap className="h-3 w-3" /> EMA20
          </button>
          <button onClick={() => setShowEMA50(!showEMA50)} className={toggle(showEMA50)} style={showEMA50 ? { background: EMA50 } : {}}>
            <Zap className="h-3 w-3" /> EMA50
          </button>
          <button onClick={() => setShowVolume(!showVolume)} className={toggle(showVolume)} style={showVolume ? { background: '#9097a3' } : {}}>
            <BarChart3 className="h-3 w-3" /> VOL
          </button>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full flex-grow relative min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]" />
      <div className="px-3 py-1.5 border-t border-line flex justify-between items-center">
        <span className="label">{data.length} BARS</span>
        <span className="flex items-center gap-1.5 label">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-up)] animate-blink" /> LIVE
        </span>
      </div>
    </div>
  )
}

export default StockChart
