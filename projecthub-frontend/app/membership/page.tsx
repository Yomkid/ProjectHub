'use client';

import React from 'react';
import { CheckIcon  } from '@heroicons/react/20/solid';


const features = [
  'Access member-only project writeups, resources, and expert insights',
  'Earn money for your writing',
  'Download project resources with zero plagiarism',
  'Access audio summaries for projects',
  'Download content to read offline',
  'Connect with a community of like-minded project enthusiasts',
  'Collect a verification badge as a certified writer',
  'Reach a larger audience and grow your influence',
  'Access many ProjectHub tools (Humanizer, AI Checker)',
  'Unlimited writing limits',
];

const Plans = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">Choose Your ProjectHub Plan</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Monthly Plan */}
          <PlanCard
            title="Monthly Plan"
            price="₦2,500/month"
            features={features}
          />

          {/* Annual Plan */}
          <PlanCard
            title="Annual Plan"
            price="₦25,000/₦20,000 per year"
            note="Save up to ₦15,000"
            features={features}
          />

          {/* Friend Plan */}
          <PlanCard
            title="Friend Plan"
            price="₦70,000/₦60,000 per year"
            features={[
              'All ProjectHub member benefits',
              'Share your resources with others and earn more',
              'Customize your profile and app icon',
              'Access to all exclusive features and tools',
              'Support the ProjectHub community with a larger contribution',
            ]}
          />
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
  <div className="bg-white shadow-lg rounded-lg p-6 text-left">
    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
    <p className="text-xl font-bold text-gray-700">{price}</p>
    {note && <p className="text-sm text-gray-500 mb-4">{note}</p>}
    <ul className="mt-4 space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start text-sm text-gray-700">
          <CheckIcon  className="h-5 w-5 text-green-500 mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
      Select Plan
    </button>
  </div>
);

export default Plans;
