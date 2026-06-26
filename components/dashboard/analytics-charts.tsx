'use client';

import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface DataPoint { date: string; value: number }

interface ChartData {
  albums?: DataPoint[];
  events?: DataPoint[];
  signups?: DataPoint[];
}

const RANGE_OPTIONS = [
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
];

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function AnalyticsChart({ data, label, color }: { data: DataPoint[]; label: string; color: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="glass-effect rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-white font-semibold text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{total.toLocaleString()}</p>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
            itemStyle={{ color: '#fff' }}
            labelFormatter={(label) => shortDate(String(label))}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${label})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AnalyticsCharts() {
  const [range, setRange] = useState(30);
  const [charts, setCharts] = useState<ChartData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<{ charts: ChartData }>(`/api/analytics?range=${range}`)
      .then(({ charts }) => setCharts(charts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  const chartList = [
    charts.signups && { data: charts.signups, label: 'User Signups', color: '#f97316' },
    charts.albums  && { data: charts.albums,  label: 'Albums Created', color: '#6366f1' },
    charts.events  && { data: charts.events,  label: 'Events Created', color: '#22d3ee' },
  ].filter(Boolean) as { data: DataPoint[]; label: string; color: string }[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-white/50 text-sm mt-1">Activity over time.</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                range === opt.value ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : chartList.length === 0 ? (
        <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
          <p className="text-white/40 text-sm">No data available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chartList.map(c => (
            <AnalyticsChart key={c.label} {...c} />
          ))}
        </div>
      )}
    </div>
  );
}
