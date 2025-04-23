'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Switch } from '@headlessui/react';

const PLANS = {
  yearly: [
    {
      id: 'basic',
      title: 'Basic Access',
      yearly: 20000,
      monthly: 20000 / 12,
      note: 'For learners who need quick access to real-world project resources.',
      features: [
        'Access curated real-life project writeups',
        'Download documentation (PDF only)',
        'Plagiarism-checked project materials',
        'Offline downloads enabled',
        'Join the ProjectHub learner community',
        'Limited access to AI tools (AI Checker Lite)',
      ],
    },
    {
      id: 'student',
      title: 'Student Access',
      yearly: 30000,
      monthly: 30000 / 12,
      note: 'Recommended for students and developers who want everything unlocked.',
      features: [
        'All Basic Access features',
        'Full access to all project categories & levels',
        'Download source code, documentation, and media assets',
        'Access to Humanizer & AI Checker Pro tools',
        'Request custom projects on demand',
        'Audio summaries for premium projects',
        'Unlimited downloads & updates',
      ],
    },
    {
      id: 'pro',
      title: 'Contributor Pro',
      yearly: 60000,
      monthly: 60000 / 12,
      note: 'Ideal for writers, educators, and tech experts who want to earn and grow.',
      features: [
        'All Student Access features',
        'Upload & monetize your own projects',
        'Get certified with a verification badge',
        'Track views, downloads, and engagement stats',
        'Customizable public profile & contributor dashboard',
        'Earn directly from downloads & referrals',
        'Priority support & early feature access',
      ],
    },
  ],
};

export default function Plans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const router = useRouter();

  const handlePlanClick = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const goToCheckout = () => {
    if (!selectedPlanId) return;
    router.push(`/checkout?plan=${selectedPlanId}&billing=${billingCycle}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Upgrade Your ProjectHub Experience</h1>
        <p className="text-gray-600 mb-8">
          Choose the plan that fits your journey — whether you’re learning, building, or earning.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-10">
          <span className="text-sm text-gray-600">Monthly</span>
          <Switch
            checked={billingCycle === 'yearly'}
            onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className={`${billingCycle === 'yearly' ? 'bg-green-600' : 'bg-gray-300'}
              relative inline-flex h-6 w-11 items-center rounded-full transition`}
          >
            <span className="sr-only">Toggle billing cycle</span>
            <span
              className={`${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
          <span className="text-sm text-gray-600">Yearly</span>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {PLANS.yearly.map((plan) => {
            const price = billingCycle === 'yearly' ? plan.yearly : plan.monthly;
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => handlePlanClick(plan.id)}
                className={`cursor-pointer bg-white border ${
                  isSelected ? 'border-green-600 ring-2 ring-green-500' : 'border-gray-200'
                } p-6 rounded-lg shadow-md hover:shadow-lg transition`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-2xl font-semibold text-gray-800">{plan.title}</h2>
                  {isSelected && <CheckIcon className="h-6 w-6 text-green-600" />}
                </div>
                <div className="text-green-600 text-xl font-bold mb-1">
                  ₦{price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-sm text-gray-500 font-normal"> / {billingCycle}</span>
                </div>
                {plan.note && <p className="text-sm text-gray-500 mb-4">{plan.note}</p>}
                <ul className="mt-4 space-y-2 text-left text-sm text-gray-700">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Floating Footer */}
        {selectedPlanId && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md px-6 py-4 flex justify-between items-center z-50">
            <div className="text-sm text-gray-700">
              You’re about to subscribe to the{' '}
              <strong className="text-green-600 capitalize">{selectedPlanId}</strong> plan –{' '}
              <span className="text-green-600 font-bold">
                ₦
                {(
                  billingCycle === 'yearly'
                    ? PLANS.yearly.find((p) => p.id === selectedPlanId)?.yearly
                    : PLANS.yearly.find((p) => p.id === selectedPlanId)?.monthly
                )?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                /{billingCycle}
              </span>
            </div>
            <button
              onClick={goToCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Continue to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
