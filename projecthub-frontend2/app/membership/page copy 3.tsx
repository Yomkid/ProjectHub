'use client';

import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

const yearlyPlans = {
  basic: {
    title: 'Basic Member',
    price: '₦20,000 / year',
    note: 'Perfect for entry-level learners',
    features: [
      'Access selected real-life project writeups',
      'Download project documentation (PDF only)',
      'Zero-plagiarism content assurance',
      'Offline access to project files',
      'Access to AI Checker Lite',
      'Join the ProjectHub community',
    ],
  },
  student: {
    title: 'Student',
    price: '₦30,000 / year',
    note: 'Best value for learners and developers',
    features: [
      'Everything in Basic',
      'Full access to all project categories',
      'Download source code, documentation & assets',
      'Audio summaries of premium projects',
      'Access full AI Checker & Humanizer tools',
      'Submit requests for custom projects',
      'Unlimited downloads',
    ],
  },
  contributor: {
    title: 'Contributor Pro',
    price: '₦60,000 / year',
    note: 'Earn from your contributions & grow influence',
    features: [
      'Everything in Student',
      'Upload & earn from your own projects',
      'Get verified as a Certified Contributor',
      'Customize public profile & branding',
      'Track analytics for your uploads',
      'Priority support from ProjectHub team',
    ],
  },
};

const monthlyPlans = {
  basic: {
    ...yearlyPlans.basic,
    price: '₦2,000 / month',
  },
  student: {
    ...yearlyPlans.student,
    price: '₦3,000 / month',
  },
  contributor: {
    ...yearlyPlans.contributor,
    price: '₦6,000 / month',
  },
};

const Plans = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const plans = billing === 'yearly' ? yearlyPlans : monthlyPlans;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Choose Your ProjectHub Plan</h1>
        <p className="text-gray-600 mb-8">Get access to real-world projects, AI tools, and documentation that sets you apart.</p>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-md shadow-sm bg-white border border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                billing === 'monthly' ? 'bg-green-600 text-white' : 'text-gray-700'
              } rounded-l-md`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                billing === 'yearly' ? 'bg-green-600 text-white' : 'text-gray-700'
              } rounded-r-md`}
              onClick={() => setBilling('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(plans).map(([key, plan]) => (
            <PlanCard
              key={key}
              title={plan.title}
              price={plan.price}
              note={plan.note}
              features={plan.features}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({
  title,
  price,
  note,
  features,
}: {
  title: string;
  price: string;
  note?: string;
  features: string[];
}) => (
  <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition">
    <h2 className="text-2xl font-semibold text-gray-800 mb-1">{title}</h2>
    <p className="text-xl font-bold text-green-600">{price}</p>
    {note && <p className="text-sm text-gray-500 mb-4">{note}</p>}
    <ul className="mt-4 space-y-3 text-left">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start text-sm text-gray-700">
          <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button className="mt-6 w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
      Select Plan
    </button>
  </div>
);

export default Plans;
