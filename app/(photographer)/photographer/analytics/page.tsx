'use client';

import { BarChart3 } from 'lucide-react';

export default function PhotographerAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/50 text-sm mt-1">Track album views, downloads, and revenue.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Album Views', 'Downloads', 'QR Scans', 'AR Activations'].map(label => (
          <div key={label} className="glass-effect rounded-2xl p-5">
            <p className="text-white/40 text-xs mb-2">{label}</p>
            <p className="text-2xl font-bold text-white">—</p>
          </div>
        ))}
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <BarChart3 className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No data yet</p>
        <p className="text-white/30 text-sm mt-2">Analytics will appear once your albums receive activity.</p>
      </div>
    </div>
  );
}
