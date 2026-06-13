import { useState, useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

// Modern palette — vivid, distinct, readable on dark surfaces
const COLORS = [
  '#5b7cfa', // Banking - indigo
  '#f59e0b', // Hydro Power - amber
  '#34d399', // Microfinance - emerald
  '#fbbf24', // Life Insurance - gold
  '#f87171', // Non-Life Insurance - rose
  '#22d3ee', // Hotels & Tourism - cyan
  '#a78bfa', // Development Bank - violet
  '#2dd4bf', // Finance - teal
  '#f472b6', // Mutual Fund - pink
  '#60a5fa', // Investment - sky
  '#fb923c', // Manufacturing - orange
  '#a3e635', // Trading - lime
  '#94a3b8', // Others - slate
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
      <div className="panel p-3 shadow-lg max-w-[260px]">
        <div className="flex items-center gap-2 mb-2 border-b border-line pb-2">
          <div className="w-2 h-2 rounded-md flex-shrink-0" style={{ backgroundColor: payload[0].fill }} />
          <p className="label truncate">{data.name}</p>
        </div>
        <p className="text-lg font-semibold text-ink tnum mb-2">Rs. {payload[0].value.toLocaleString()}</p>
        <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-1">
          {data.stocks.map((stock, i) => (
            <div key={i} className="flex items-center justify-between gap-3 text-[11px] font-mono">
              <span className="text-muted truncate">{stock.symbol}</span>
              <span className="text-faint tnum flex-shrink-0">{stock.qty.toLocaleString()}</span>
              <span className="text-ink tnum flex-shrink-0">{stock.val.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-line flex items-center justify-between label">
          <span>{data.stocks.length} POS</span>
          <span>{((payload[0].value / data.total) * 100).toFixed(1)}% WT</span>
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
      <div className="h-48 flex items-center justify-center">
        <div className="px-4 py-3 border border-dashed border-line rounded-lg">
          <p className="label">AWAITING POSITIONS</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-72 sm:h-80 lg:h-96 w-full -mt-2">
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
                <span className={`text-[10px] font-mono uppercase tracking-wide ml-1 mr-2 ${hasValue ? 'text-ink' : 'text-faint'}`}>
                  {value} <span className="text-faint ml-0.5">{percent}%</span>
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
