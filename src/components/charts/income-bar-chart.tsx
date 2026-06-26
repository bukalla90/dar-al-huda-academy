// src/components/charts/income-bar-chart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface IncomeData {
  month: string;
  income: number;
  color: string;
}

interface IncomeBarChartProps {
  data: IncomeData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: IncomeData;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload }: CustomTooltipProps): React.ReactNode {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {data.payload.month}
        </p>
        <p className="text-sm text-primary font-bold">
          ETB {data.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}

export function IncomeBarChart({ data }: IncomeBarChartProps): React.ReactNode {
  if (data.length === 0) {
    return <p className="text-center text-gray-500 py-8">No data available</p>;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value: number) => value > 0 ? `${(value / 1000).toFixed(0)}k` : '0'}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#0F766E'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}