'use client';

import { CreditCard, Zap, Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['Up to 100 feedback posts', '1 active survey', 'Basic analytics', '2 team members'],
    current: true,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    features: ['Unlimited feedback posts', 'Unlimited surveys', 'Advanced analytics', 'Unlimited members', 'Custom domain', 'Priority support'],
    current: false,
  },
];

export function SettingsBillingPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl space-y-8 p-6 pb-12">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Billing</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your subscription and payment details.
        </p>
      </div>

      {/* Current plan */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Current plan</p>
            <p className="mt-1 text-2xl font-bold text-foreground">Free</p>
            <p className="mt-0.5 text-sm text-muted-foreground">You&apos;re on the free plan.</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Plan comparison */}
      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-xl border bg-card p-5 ${plan.current ? 'border-primary/40 ring-2 ring-primary/20' : ''}`}
          >
            {plan.current && (
              <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Current
              </span>
            )}
            <p className="text-base font-bold text-foreground">{plan.name}</p>
            <p className="mt-1">
              <span className="text-2xl font-bold text-foreground">{plan.price}</span>
              <span className="ml-1 text-xs text-muted-foreground">/ {plan.period}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            {!plan.current && (
              <button className="mt-5 w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                Upgrade to Pro
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment method */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Payment method</p>
              <p className="text-xs text-muted-foreground">No payment method added</p>
            </div>
          </div>
          <button className="rounded-lg border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            Add card
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
