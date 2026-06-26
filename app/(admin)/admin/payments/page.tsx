'use client';

import { CreditCard } from 'lucide-react';

export default function AdminPayments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-white/50 text-sm mt-1">All transactions and revenue across the platform.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {['Total Revenue', 'This Month', 'Pending'].map(label => (
          <div key={label} className="glass-effect rounded-2xl p-5">
            <p className="text-white/40 text-xs mb-2">{label}</p>
            <p className="text-2xl font-bold text-white">—</p>
          </div>
        ))}
      </div>
      <div className="glass-effect rounded-2xl p-16 flex flex-col items-center text-center">
        <CreditCard className="w-14 h-14 text-white/20 mb-4" />
        <p className="text-white/50 font-semibold text-lg">No transactions yet</p>
        <p className="text-white/30 text-sm mt-2">Payment records will appear here.</p>
      </div>
    </div>
  );
}
