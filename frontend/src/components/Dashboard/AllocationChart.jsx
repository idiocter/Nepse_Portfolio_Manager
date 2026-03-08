import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = [
  'rgba(33, 77, 4, 1)', // Banking - zinc-900 (Strong)
  '#3b82f6', // Hydro - blue-500 (Water/Energy)
  '#10b981', // Microfinance - emerald-500 (Growth)
  '#f59e0b', // Insurance - amber-500 (Golden)
  '#f43f5e', // Hotels - rose-500 (Hospitality)
  '#8b5cf6', // Dev Bank - violet-500
  '#06b6d4', // Finance - cyan-500
  '#a855f7', // Mutual Fund - purple-500
  '#6366f1', // Investment - indigo-500
  '#71717a', // Others - zinc-500
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md border border-zinc-100 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-3 border-b border-zinc-50 pb-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].fill }} />
          <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest leading-none mt-0.5">{data.name}</p>
        </div>

        <p className="text-xl font-black text-zinc-900 tracking-tighter mb-4">
          Rs. {payload[0].value.toLocaleString()}
        </p>

        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {data.stocks.map((stock, i) => (
            <div key={i} className="flex items-center justify-between gap-4 text-[9px] font-bold">
              <span className="text-zinc-400 uppercase tracking-wider">{stock.symbol}</span>
              <span className="text-zinc-900 tabular-nums">{stock.qty.toLocaleString()} Shares</span>
              <span className="text-zinc-500 tabular-nums">Rs. {stock.val.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-zinc-50 flex items-center justify-between text-[8px] font-bold text-zinc-300 uppercase tracking-widest">
          <span>{data.stocks.length} Positions</span>
          <span>{((payload[0].value / data.total) * 100).toFixed(1)}% Weight</span>
        </div>
      </div>
    );
  }
  return null;
};

const AllocationChart = ({ holdings }) => {
  const totalValue = holdings.reduce((sum, h) => sum + (h.currentValue || 0), 0);

  // Group holdings by sector string
  const allocation = holdings.reduce((acc, h) => {
    const sectorName = h.sector || 'Others';

    if (!acc[sectorName]) {
      acc[sectorName] = { value: 0, stocks: [] };
    }
    acc[sectorName].value += h.currentValue || 0;
    acc[sectorName].stocks.push({
      symbol: h.symbol,
      qty: h.quantity,
      val: h.currentValue
    });
    return acc;
  }, {});

  const data = Object.entries(allocation)
    .map(([name, payload]) => ({
      name,
      value: payload.value,
      stocks: payload.stocks,
      total: totalValue
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Awaiting Transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-96 w-full -mt-4 animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={6}
            dataKey="value"
            stroke="none"
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            isAnimationActive={true}
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="hover:opacity-80 transition-all duration-300 outline-none hover:scale-105"
                style={{ transformOrigin: 'center' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: '32px' }}
            formatter={(value, entry) => {
              const { payload } = entry;
              const percent = payload ? ((payload.value / totalValue) * 100).toFixed(1) : 0;
              return (
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mr-3">
                  {value} <span className="text-zinc-300 font-bold ml-1">{percent}%</span>
                </span>
              )
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AllocationChart