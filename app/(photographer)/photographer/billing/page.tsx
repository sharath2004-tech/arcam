'use client';

import { CreditCard } from 'lucide-react';

export default function PhotographerBilling() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-white/50 text-sm mt-1">Manage your plan and payment history.</p>
      </div>
      <div className="glass-effect rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-lg">Photographer Free</p>
            <p className="text-white/40 text-sm">Up to 20 events · 50 customers</p>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
            Upgrade
          </button>
        </div>
      </div>
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Payment History</h2>
        <div className="flex flex-col items-center py-8 text-center">
          <CreditCard className="w-10 h-10 text-white/20 mb-3" />
          <p className="text-white/40 text-sm">No payments yet</p>
        </div>
      </div>
    </div>
  );
}
