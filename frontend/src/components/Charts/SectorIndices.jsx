import { useState, useEffect } from 'react'
import axios from 'axios'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const SectorIndices = () => {
    const [sectors, setSectors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/market/sectors`)
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
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-100 border-b-zinc-900"></div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Indexing Markets...</p>
            </div>
        )
    }

    return (
        <div className="h-full overflow-hidden flex flex-col">
            <div className="flex-grow overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {sectors.map((sector) => {
                    const isPositive = sector.change >= 0
                    return (
                        <div
                            key={sector.id}
                            className="group flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:bg-white transition-all duration-300"
                        >
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tight truncate max-w-[120px]">
                                    {sector.index.replace(' Index', '').replace(' SubIndex', '')}
                                </span>
                                <span className="text-xs font-bold text-zinc-400 tabular-nums">
                                    {sector.currentValue.toLocaleString()}
                                </span>
                            </div>
                            <div className={`flex flex-col items-end px-3 py-1 rounded-xl ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                <div className="flex items-center gap-1 font-black text-[10px] tabular-nums">
                                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {isPositive ? '+' : ''}{sector.perChange.toFixed(2)}%
                                </div>
                                <span className="text-[9px] font-bold opacity-70 tabular-nums">
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
