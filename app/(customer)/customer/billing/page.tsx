'use client';

import { CreditCard, Zap } from 'lucide-react';

export default function CustomerBilling() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-white/50 text-sm mt-1">Manage your subscription and payment history.</p>
      </div>

      {/* Current Plan */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Current Plan</h2>
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60">Free</span>
        </div>
        <p className="text-white/40 text-sm">You are on the free plan. Upgrade to unlock unlimited albums, downloads, and AR features.</p>
        <button
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
        >
          <Zap className="w-4 h-4" />
          Upgrade to Premium
        </button>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Payment History</h2>
        <div className="glass-effect rounded-2xl p-12 flex flex-col items-center text-center">
          <CreditCard className="w-12 h-12 text-white/20 mb-4" />
          <p className="text-white/50 font-medium">No payments yet</p>
          <p className="text-white/30 text-sm mt-1">Your payment history will appear here.</p>
        </div>
      </div>
    </div>
  );
}
