'use client';

import { ShieldCheck } from 'lucide-react';

const PLANS = [
  { name: 'Customer Free', price: '$0', features: ['5 albums', 'AR camera', 'QR scan'] },
  { name: 'Customer Pro', price: '$9/mo', features: ['Unlimited albums', 'Priority support', 'Downloads'] },
  { name: 'Photographer Starter', price: '$19/mo', features: ['20 events', '50 customers', 'Analytics'] },
  { name: 'Photographer Pro', price: '$49/mo', features: ['Unlimited events', 'Unlimited customers', 'Revenue reports'] },
  { name: 'Studio Basic', price: '$79/mo', features: ['5 members', '100 albums', 'Booking calendar'] },
  { name: 'Studio Pro', price: '$149/mo', features: ['Unlimited members', 'Unlimited albums', 'Advanced analytics'] },
];

export default function AdminPlans() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Plans</h1>
        <p className="text-white/50 text-sm mt-1">Manage subscription plans available on the platform.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLANS.map(plan => (
          <div key={plan.name} className="glass-effect rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}>
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{plan.name}</p>
                <p className="text-white/40 text-xs">{plan.price}</p>
              </div>
            </div>
            <ul className="space-y-1">
              {plan.features.map(f => (
                <li key={f} className="text-white/50 text-xs flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
