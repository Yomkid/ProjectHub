'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Switch } from '@headlessui/react';
import { PLANS } from '../membership/plans';


export default function MembershipPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(PLANS.yearly[0]?.id ?? null);
  const router = useRouter();

  const handlePlanClick = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const goToCheckout = () => {
    if (!selectedPlanId) return;

    const plan = PLANS.yearly.find((p) => p.id === selectedPlanId);
    const amount = billingCycle === 'yearly' ? plan?.yearly : plan?.monthly;

    if (typeof window !== 'undefined' && (window as any).FlutterwaveCheckout) {
      (window as any).FlutterwaveCheckout({
        public_key: 'FLWPUBK_TEST-8474764d531821c26fefd75c7730dcbd-X', // Replace with your real public key
        tx_ref: Date.now().toString(),
        amount: amount,
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd',
        customer: {
          email: 'user@example.com', // Replace with actual user data
          phonenumber: '08012345678',
          name: 'ProjectHub User',
        },
        customizations: {
          title: 'ProjectHub Membership',
          description: `${plan?.title} plan - ${billingCycle} billing`,
          logo: 'https://yourdomain.com/logo.png',
        },
        callback: function (response: any) {
          console.log('Payment response:', response);
          // Optionally verify transaction on backend or update subscription status
        },
        onclose: function () {
          console.log('Payment closed');
        },
      });
    } else {
      console.error('FlutterwaveCheckout not defined');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Upgrade Your ProjectHub Experience</h1>
        <p className="text-gray-600 mb-8">
          Choose the plan that fits your journey — whether you’re learning, building, or earning.
        </p>

        {/* Billing Cycle Toggle */}
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
              className={`${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'}
        inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>

          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">Yearly</span>
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
              Best Option
            </span>
          </div>
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
                className={`cursor-pointer bg-white border ${isSelected ? 'border-green-600 ring-2 ring-green-500' : 'border-gray-200'
                  } p-6 rounded-lg shadow-md hover:shadow-lg transition`}
              >
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-2xl font-semibold text-gray-800">{plan.title}</h2>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center 
  ${isSelected ? 'bg-green-600' : 'bg-gray-300'}`}>
  {isSelected && <CheckIcon className="h-4 w-4 text-white font-bold" />}
</div>



                </div>
                <div className="text-green-600 text-4xl font-bold mb-1">
                  ₦{price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-sm text-gray-500 font-normal"> / {billingCycle}</span>
                </div>
                {plan.note && <p className="text-sm text-gray-500 mb-4">{plan.note}</p>}
                {plan.prevpackage && <p className="text-sm text-gray-700 font-bold text-left mb-1">{plan.prevpackage}</p>}
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

        {/* Floating Checkout Footer */}
        {selectedPlanId && (
          <div className="fixed bottom-0 left-0 right-0 backdrop-bflur-md bg-white/90 border-t border-gray-100 shadow-md px-4 py-4 z-50">
            <div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-l font-bold text-gray-700 text-center sm:text-left">
                You’re about to subscribe to the{' '}
                <strong className="text-green-600 capitalize">{selectedPlanId}</strong> plan
                <div className="text-green-600 font-bold text-4xl">
                  ₦
                  {(
                    billingCycle === 'yearly'
                      ? PLANS.yearly.find((p) => p.id === selectedPlanId)?.yearly
                      : PLANS.yearly.find((p) => p.id === selectedPlanId)?.monthly
                  )?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <span className="text-sm text-gray-500 font-bold"> / {billingCycle}</span>
                </div>
              </div>
              <button
                onClick={goToCheckout}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full sm:w-auto"
              >
                Subscribe & Pay
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
