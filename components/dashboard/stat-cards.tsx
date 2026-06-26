'use client';

import { api } from '@/lib/api';
import { useEffect, useState } from 'react';

type StatItem = { label: string; key: string };

interface StatCardsProps {
  items: StatItem[];
}

export default function StatCards({ items }: StatCardsProps) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ stats: Record<string, number> }>('/api/stats')
      .then(({ stats }) => setStats(stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map(({ label, key }) => (
        <div key={key} className="glass-effect rounded-2xl p-5">
          <p className="text-white/40 text-xs mb-2">{label}</p>
          {loading ? (
            <div className="w-8 h-6 bg-white/10 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-white">
              {stats[key] !== undefined ? stats[key].toLocaleString() : '—'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
