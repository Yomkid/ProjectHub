'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PLANS } from '../membership/plans';

const Checkout = () => {
  const params = useSearchParams();
  const router = useRouter();
  const planId = params.get('plan_id');
  const billing = (params.get('billing') || 'yearly') as 'monthly' | 'yearly';

  const [plan, setPlan] = useState<{
    id: string;
    title: string;
    yearly: number;
    monthly: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    if (!planId) return;

    const found =
      billing === 'monthly'
        ? PLANS.yearly.find((p) => p.id === planId && billing === 'monthly')
        : PLANS.yearly.find((p) => p.id === planId);

    if (found) setPlan(found);
    setLoading(false);
  }, [planId, billing]);

  const handlePay = () => {
    if (!form.email || !form.name) {
      alert('Please fill in your name and email.');
      return;
    }

    if (!plan) return;

    const amount = billing === 'monthly' ? plan.monthly : plan.yearly;

    //@ts-ignore
    FlutterwaveCheckout({
      public_key: 'FLWPUBK_TEST-8474764d531821c26fefd75c7730dcbd-X',
      tx_ref: `PH-${Date.now()}`,
      amount: amount,
      currency: 'NGN',
      customer: {
        email: form.email,
        name: form.name,
      },
      customizations: {
        title: 'ProjectHub',
        description: `Subscription for ${plan.title} - ${billing}`,
        logo: '/logo.png',
      },
      callback: (response: any) => {
        router.push(
          `/payment-success?ref=${response.transaction_id}&plan=${plan.title}`
        );
      },
      onclose: () => {
        console.log('Payment closed');
      },
    });
  };

  if (loading)
    return <p className="text-center py-20 text-gray-600">Loading plan...</p>;

  if (!plan)
    return (
      <p className="text-center text-red-500 py-20">
        Plan not found. Please return and choose again.
      </p>
    );

  const price = billing === 'monthly' ? plan.monthly : plan.yearly;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow mt-10 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout - {plan.title}</h2>

      <div className="mb-4">
        <p className="text-xl font-semibold">
          ₦{price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
        <p className="text-sm text-gray-500 capitalize">{billing} billing</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border px-3 py-2 mb-3 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border px-3 py-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <button
        onClick={handlePay}
        className="w-full bg-green-600 text-white py-2 mt-4 hover:bg-green-700 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;
