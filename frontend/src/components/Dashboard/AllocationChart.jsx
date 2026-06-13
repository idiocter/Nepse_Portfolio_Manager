import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = [
  '#2563eb', // Banking - blue-600
  '#06b6d4', // Hydro Power - cyan-500
  '#10b981', // Microfinance - emerald-500
  '#f59e0b', // Life Insurance - amber-500
  '#f43f5e', // Non-Life Insurance - rose-500
  '#f97316', // Hotels & Tourism - orange-500
  '#8b5cf6', // Development Bank - violet-500
  '#6366f1', // Finance - indigo-500
  '#d946ef', // Mutual Fund - fuchsia-500
  '#0ea5e9', // Investment - sky-500
  '#ec4899', // Manufacturing & Processing - pink-500
  '#14b8a6', // Trading - teal-500
  '#94a3b8', // Others - slate-400
]

const ALL_SECTORS = [
  'Banking',
  'Development Bank',
  'Finance',
  'Hotels & Tourism',
  'Hydro Power',
  'Investment',
  'Life Insurance',
  'Manufacturing & Processing',
  'Microfinance',
  'Mutual Fund',
  'Non-Life Insurance',
  'Others',
  'Trading'
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-100 dark:border-zinc-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl max-w-[280px] sm:max-w-xs transition-colors duration-300">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 border-b border-zinc-50 dark:border-zinc-800 pb-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: payload[0].fill }} />
          <p className="text-[10px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest leading-none mt-0.5 truncate">{data.name}</p>
        </div>

        <p className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter mb-3 sm:mb-4">
          Rs. {payload[0].value.toLocaleString()}
        </p>

        <div className="space-y-1.5 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {data.stocks.map((stock, i) => (
            <div key={i} className="flex items-center justify-between gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-bold">
              <span className="text-zinc-400 dark:text-zinc-500 uppercase tracking-wider truncate">{stock.symbol}</span>
              <span className="text-zinc-900 dark:text-zinc-200 tabular-nums flex-shrink-0">{stock.qty.toLocaleString()} Shares</span>
              <span className="text-zinc-500 dark:text-zinc-400 tabular-nums flex-shrink-0">Rs. {stock.val.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between text-[8px] sm:text-[10px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">
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
    let sectorName = h.sector || 'Others';

    // Normalize names for fuzzy matching if needed
    if (sectorName.includes('Banking')) sectorName = 'Banking';
    if (sectorName.includes('Development')) sectorName = 'Development Bank';
    if (sectorName.includes('Hydro')) sectorName = 'Hydro Power';
    if (sectorName.includes('Microfinance')) sectorName = 'Microfinance';
    if (sectorName.includes('Mutual')) sectorName = 'Mutual Fund';
    if (sectorName.includes('Non-Life') || sectorName === 'Insurance') sectorName = 'Non-Life Insurance';
    if (sectorName.includes('Life Insurance')) sectorName = 'Life Insurance';
    if (sectorName.includes('Hotels')) sectorName = 'Hotels & Tourism';
    if (sectorName.includes('Manufacturing')) sectorName = 'Manufacturing & Processing';

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

  // Create full data set including empty sectors
  const data = ALL_SECTORS.map(sector => {
    const payload = allocation[sector] || { value: 0, stocks: [] };
    return {
      name: sector,
      value: payload.value,
      stocks: payload.stocks,
      total: totalValue
    };
  }).sort((a, b) => b.value - a.value);

  // For the actual chart, we only want sectors with value
  const chartData = data.filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-48 sm:h-64 flex flex-col items-center justify-center space-y-3 sm:space-y-4">
        <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Awaiting Transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-72 sm:h-80 lg:h-96 w-full -mt-2 sm:-mt-4 animate-fade-in">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            isAnimationActive={true}
            labelLine={false}
            label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
          >
            {chartData.map((entry, index) => {
              const baseIndex = ALL_SECTORS.indexOf(entry.name);
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[baseIndex !== -1 ? baseIndex : (index % COLORS.length)]}
                  className="hover:opacity-80 transition-all duration-300 outline-none hover:scale-105"
                  style={{ transformOrigin: 'center' }}
                />
              );
            })}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            layout="horizontal"
            wrapperStyle={{
              paddingTop: '24px',
              fontSize: '10px',
              width: '100%',
              maxHeight: '120px',
              overflowY: 'auto'
            }}
            formatter={(value, entry) => {
              const item = data.find(d => d.name === value);
              const percent = item && totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0.0';
              const hasValue = item && item.value > 0;

              return (
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ml-1 mr-2 sm:mr-3 transition-colors ${hasValue ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-300 dark:text-zinc-700'}`}>
                  {value} <span className={`font-bold ml-1 ${hasValue ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-200 dark:text-zinc-800'}`}>{percent}%</span>
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
