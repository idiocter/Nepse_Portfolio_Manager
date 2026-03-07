import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = [
  '#18181b', // zinc-900
  '#3f3f46', // zinc-700
  '#71717a', // zinc-500
  '#a1a1aa', // zinc-400
  '#27272a', // zinc-800
  '#52525b', // zinc-600
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
]

const AllocationChart = ({ holdings }) => {
  const data = holdings.map(h => ({
    name: h.symbol,
    value: h.currentValue
  })).filter(h => h.value > 0)

  if (data.length === 0) {
    return (
      <div className="bg-white border border-zinc-100 rounded-3xl h-80 flex items-center justify-center p-8 shadow-sm">
        <p className="text-xs font-black text-zinc-300 uppercase tracking-[0.2em]">No allocation data</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
      <h3 className="text-xl font-black text-zinc-900 mb-8 tracking-tighter text-center">Portfolio Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
            itemStyle={{ fontWeight: '800', fontSize: '12px', color: '#18181b' }}
            formatter={(value) => `Rs. ${value.toLocaleString()}`}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AllocationChart