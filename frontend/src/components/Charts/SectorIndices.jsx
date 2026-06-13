import { useState, useEffect } from 'react'
import marketService from '../../services/marketService'
import { formatPercent } from '../../utils/formatters'

const SectorIndices = () => {
    const [sectors, setSectors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSectors = async () => {
            try { setSectors(await marketService.getSectorIndices()) }
            catch (error) { console.error('Error fetching sectors:', error) }
            finally { setLoading(false) }
        }
        fetchSectors()
        const interval = setInterval(fetchSectors, 60000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-line border-b-[var(--color-accent)]" />
                <p className="label">INDEXING…</p>
            </div>
        )
    }

    return (
        <div className="space-y-1">
            {sectors.map((sector) => {
                const isPositive = sector.change >= 0
                return (
                    <div key={sector.id} className="flex items-center justify-between px-2 py-1.5 hover:bg-sunk transition-colors rounded-[2px]">
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold text-ink truncate max-w-[120px]">
                                {sector.index.replace(' Index', '').replace(' SubIndex', '')}
                            </p>
                            <p className="text-[11px] text-faint tnum">{sector.currentValue.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className={`text-[11px] tnum ${isPositive ? 'up' : 'down'}`}>
                                {isPositive ? '▲' : '▼'} {formatPercent(sector.perChange)}
                            </p>
                            <p className={`text-[10px] tnum ${isPositive ? 'up' : 'down'} opacity-70`}>
                                {isPositive ? '+' : ''}{sector.change.toFixed(2)}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default SectorIndices
