import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

const AllocationChart = ({ holdings }) => {
  const data = holdings.map(h => ({
    name: h.symbol,
    value: h.currentValue
  })).filter(h => h.value > 0)

  if (data.length === 0) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <p className="text-gray-500">No holdings to display</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Portfolio Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AllocationChart