'use client';

import { api } from '@/lib/api';
import { CheckCircle, CreditCard, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  recommended?: boolean;
}

interface BillingPageProps {
  role: string;
  currentPlanId?: string;
}

function formatPrice(price: number, currency: string) {
  if (price === 0) return 'Free';
  return `${currency === 'INR' ? '₹' : '$'}${price}`;
}

export default function BillingPage({ role, currentPlanId }: BillingPageProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    api.get<{ plans: Plan[] }>(`/api/plans?role=${role}`)
      .then(({ plans }) => setPlans(plans))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [role]);

  const currentPlan = plans.find(p => p.id === currentPlanId) ?? plans[0];

  async function handleUpgrade() {
    if (!selected) return;
    setUpgrading(true);
    // TODO: integrate Razorpay/Stripe checkout here
    await new Promise(r => setTimeout(r, 1200));
    alert(`Upgrade to ${selected.name} — payment gateway coming soon.`);
    setUpgrading(false);
    setSelected(null);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-white/50 text-sm mt-1">Manage your plan and payment history.</p>
      </div>

      {/* Current plan */}
      {!loading && currentPlan && (
        <div className="glass-effect rounded-2xl p-6 space-y-1">
          <p className="text-white/40 text-xs uppercase tracking-widest">Current Plan</p>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-white font-bold text-xl">{currentPlan.name}</p>
              <p className="text-white/40 text-sm mt-0.5">
                {formatPrice(currentPlan.price, currentPlan.currency)}
                {currentPlan.price > 0 ? ` / ${currentPlan.interval}` : ' forever'}
              </p>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400">Active</div>
          </div>
        </div>
      )}

      {/* Plans grid */}
      <div>
        <h2 className="text-white font-semibold mb-4">Available Plans</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map(plan => {
              const isCurrent = plan.id === (currentPlan?.id);
              return (
                <div
                  key={plan.id}
                  onClick={() => !isCurrent && setSelected(plan)}
                  className={[
                    'glass-effect rounded-2xl p-6 space-y-4 transition-all',
                    plan.recommended ? 'border-primary/30' : '',
                    isCurrent ? 'opacity-60 cursor-default' : 'cursor-pointer hover:bg-white/5',
                    selected?.id === plan.id ? 'ring-2 ring-primary/50' : '',
                  ].join(' ')}
                >
                  {plan.recommended && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15 / 0.3), oklch(0.72 0.14 55 / 0.3))', color: 'oklch(0.85 0.12 55)' }}>
                      Recommended
                    </span>
                  )}
                  <div>
                    <p className="text-white font-bold text-lg">{plan.name}</p>
                    <p className="text-white/60 text-sm">
                      <span className="text-2xl font-bold text-white">{formatPrice(plan.price, plan.currency)}</span>
                      {plan.price > 0 && <span className="text-white/40"> / {plan.interval}</span>}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-white/60 text-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <div className="w-full py-2 rounded-xl text-center text-xs text-white/30 border border-white/10">
                      Current plan
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelected(plan)}
                      className="w-full py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
                    >
                      {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="glass-effect rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Payment History</h2>
        <div className="flex flex-col items-center py-8 text-center">
          <CreditCard className="w-10 h-10 text-white/20 mb-3" />
          <p className="text-white/40 text-sm">No payments yet</p>
        </div>
      </div>

      {/* Upgrade confirmation modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-effect rounded-2xl w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary shrink-0" />
              <h2 className="text-white font-semibold">Upgrade to {selected.name}</h2>
            </div>
            <p className="text-white/50 text-sm">
              You&apos;ll be charged {formatPrice(selected.price, selected.currency)}
              {selected.price > 0 ? ` per ${selected.interval}` : ''}.
              Payment gateway integration coming soon.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, oklch(0.55 0.24 15), oklch(0.72 0.14 55))' }}
              >
                {upgrading ? 'Processing…' : 'Confirm Upgrade'}
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2.5 rounded-xl text-sm text-white/60 border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
