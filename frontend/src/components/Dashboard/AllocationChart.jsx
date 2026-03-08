import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = [
  '#18181b', // zinc-900
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
  '#06b6d4', // cyan-500
  '#71717a', // zinc-500
  '#d4d4d8', // zinc-300
]

const AllocationChart = ({ holdings }) => {
  // Group holdings by sector
  const sectorGroups = holdings.reduce((acc, h) => {
    const sector = h.sector || 'N/A';
    if (!acc[sector]) {
      acc[sector] = 0;
    }
    acc[sector] += h.currentValue || 0;
    return acc;
  }, {});

  const data = Object.entries(sectorGroups)
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-white border border-zinc-100 rounded-3xl h-80 flex items-center justify-center p-8 shadow-sm">
        <p className="text-xs font-black text-zinc-300 uppercase tracking-[0.2em]">No allocation data</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
      <h3 className="text-xl font-black text-zinc-900 mb-8 tracking-tighter text-center">Sector Allocation</h3>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              padding: '12px 16px',
              background: '#fff'
            }}
            itemStyle={{ fontWeight: '800', fontSize: '12px', color: '#18181b' }}
            formatter={(value) => `Rs. ${Number(value).toLocaleString()}`}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            layout="horizontal"
            iconType="circle"
            formatter={(value) => (
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mr-3">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AllocationChart