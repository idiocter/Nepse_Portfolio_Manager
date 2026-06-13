import { useState, useEffect } from 'react'
import marketService from '../../services/marketService'
import { formatPercent } from '../../utils/formatters'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const SectorIndices = () => {
    const [sectors, setSectors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const data = await marketService.getSectorIndices()
                setSectors(data)
            } catch (error) {
                console.error('Error fetching sectors:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSectors()
        const interval = setInterval(fetchSectors, 60000) // update every minute
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-zinc-100 dark:border-zinc-800 border-b-zinc-900 dark:border-b-zinc-100 transition-colors"></div>
                <p className="text-[9px] sm:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Indexing Markets...</p>
            </div>
        )
    }

    return (
        <div className="h-full overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto pr-1 sm:pr-2 space-y-2 sm:space-y-3 custom-scrollbar">
                {sectors.map((sector) => {
                    const isPositive = sector.change >= 0
                    return (
                        <div
                            key={sector.id}
                            className="group flex items-center justify-between p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300"
                        >
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] sm:text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight truncate max-w-[100px] sm:max-w-[120px] lg:max-w-[150px] transition-colors">
                                    {sector.index.replace(' Index', '').replace(' SubIndex', '')}
                                </span>
                                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 tabular-nums transition-colors">
                                    {sector.currentValue.toLocaleString()}
                                </span>
                            </div>
                            <div className={`flex flex-col items-end px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl transition-colors ${isPositive ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'}`}>
                                <div className="flex items-center gap-0.5 sm:gap-1 font-black text-[9px] sm:text-[10px] tabular-nums">
                                    {isPositive ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                                    {formatPercent(sector.perChange)}
                                </div>
                                <span className="text-[8px] sm:text-[9px] font-bold opacity-70 tabular-nums">
                                    {isPositive ? '+' : ''}{sector.change.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SectorIndices
