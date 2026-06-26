'use client';

import { Button } from '@/components/ui/button-glass';
import { Card } from '@/components/dashboard/card';
import { Check, X } from 'lucide-react';

export default function BillingPage() {
  const plans = [
    {
      name: 'Basic',
      price: 9,
      description: 'Perfect for getting started',
      features: [
        'Up to 10 albums',
        'Basic AR effects',
        '5GB storage',
        'Email support',
      ],
      notIncluded: [
        'Priority support',
        'Custom AR overlays',
        'Team collaboration',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: 29,
      description: 'For serious photographers',
      features: [
        'Unlimited albums',
        'Advanced AR effects',
        '500GB storage',
        'Priority email support',
        'Team collaboration',
        'Analytics dashboard',
      ],
      notIncluded: [
        'API access',
        'Custom branding',
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Studio',
      price: 99,
      description: 'For professional studios',
      features: [
        'Everything in Pro',
        'Unlimited storage',
        'Phone & email support',
        'Custom branding',
        'API access',
        'Team management',
        '24/7 support',
      ],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and view billing history</p>
      </div>

      {/* Current Plan */}
      <div className="card-glass">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Your Current Plan</h3>
            <p className="text-muted-foreground">Pro - $29/month</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Next billing date</p>
            <p className="font-bold">June 15, 2024</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card title="Storage Used" value="245 GB" subtitle="of 500 GB" />
          <Card title="Albums" value="28" subtitle="Active" />
          <Card title="Users" value="3" subtitle="Team members" />
        </div>
      </div>

      {/* Upgrade Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card-glass relative ${plan.popular ? 'md:scale-105 md:shadow-2xl border-2 border-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <Button className="w-full mb-6">
                {plan.cta}
              </Button>

              <div className="space-y-3 pb-6 border-b border-border">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.notIncluded.length > 0 && (
                <div className="space-y-3 pt-6">
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 opacity-50">
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="card-glass">
        <h2 className="text-2xl font-bold mb-6">Billing History</h2>
        <div className="space-y-3">
          {[
            { date: 'May 15, 2024', amount: '$29.00', status: 'Paid' },
            { date: 'Apr 15, 2024', amount: '$29.00', status: 'Paid' },
            { date: 'Mar 15, 2024', amount: '$29.00', status: 'Paid' },
            { date: 'Feb 15, 2024', amount: '$29.00', status: 'Paid' },
          ].map((invoice, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{invoice.date}</p>
                <p className="text-xs text-muted-foreground">Pro Plan</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{invoice.amount}</p>
                <p className="text-xs text-green-600">{invoice.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
