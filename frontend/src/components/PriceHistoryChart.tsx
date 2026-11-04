"use client";

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatINR } from '@/lib/priceConverter';
import { AlertCircle } from 'lucide-react';

interface HistoryPoint {
  price: number;
  store: string;
  date: string;
}

interface PriceHistoryChartProps {
  data: HistoryPoint[];
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  // Transform data: group by date (YYYY-MM-DD or shorter)
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { points: [], stores: [] };
    
    // Reverse so chronological (oldest to newest)
    const reversedData = [...data].reverse();

    const grouped: Record<string, Record<string, number | string>> = {};
    const storeNames = new Set<string>();

    reversedData.forEach((point) => {
      // Use just the date part (e.g. "2026-05-31") or "MM-DD HH:mm"
      const dateKey = point.date.substring(5, 16); // e.g., "05-31 10:00"
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey };
      }
      
      grouped[dateKey][point.store] = point.price;
      storeNames.add(point.store);
    });

    return {
      points: Object.values(grouped),
      stores: Array.from(storeNames)
    };
  }, [data]);

  if (!data || chartData.points.length < 1) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-muted/20 rounded-2xl border border-dashed border-border/60">
        <p className="text-muted-foreground font-medium">Tracking Started. Not enough historical data yet.</p>
      </div>
    );
  }

  // Generate distinct colors for stores
  const colors = ["#3b82f6", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

  return (
    <div className="w-full h-80 sm:h-96 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData.points}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatINR(value)}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))', 
              borderColor: 'hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            itemStyle={{ fontSize: 14, fontWeight: 600 }}
            formatter={(value: unknown) => [formatINR(Number(value)), '']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          {chartData.stores.map((store: string, index: number) => (
            <Line
              key={store}
              type="monotone"
              dataKey={store}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
