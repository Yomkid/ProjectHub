import React from 'react';

const Plans = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">
          Choose Your ProjectHub Plan
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Monthly Plan */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Monthly Plan</h2>
            <p className="text-xl font-bold text-gray-700">₦2,500/month</p>
            <ul className="text-left mt-4 space-y-2">
              <li>Access member-only project writeups, resources, and expert insights</li>
              <li>Earn money for your writing</li>
              <li>Download project resources with zero plagiarism</li>
              <li>Access audio summaries for projects</li>
              <li>Download content to read offline</li>
              <li>Connect with a community of like-minded project enthusiasts</li>
              <li>Collect a verification badge as a certified writer</li>
              <li>Reach a larger audience and grow your influence</li>
              <li>Access many ProjectHub tools (Humanizer, AI Checker)</li>
              <li>Unlimited writing limits</li>
            </ul>
            <button className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Select Plan
            </button>
          </div>

          {/* Annual Plan */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Annual Plan</h2>
            <p className="text-xl font-bold text-gray-700">₦25,000/₦20,000 per year</p>
            <p className="text-sm text-gray-500 mb-4">Save up to ₦15,000</p>
            <ul className="text-left mt-4 space-y-2">
              <li>Access member-only project writeups, resources, and expert insights</li>
              <li>Earn money for your writing</li>
              <li>Download project resources with zero plagiarism</li>
              <li>Access audio summaries for projects</li>
              <li>Download content to read offline</li>
              <li>Connect with a community of like-minded project enthusiasts</li>
              <li>Collect a verification badge as a certified writer</li>
              <li>Reach a larger audience and grow your influence</li>
              <li>Access many ProjectHub tools (Humanizer, AI Checker)</li>
              <li>Unlimited writing limits</li>
            </ul>
            <button className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Select Plan
            </button>
          </div>

          {/* Friend Plan */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friend Plan</h2>
            <p className="text-xl font-bold text-gray-700">₦70,000/₦60,000 per year</p>
            <ul className="text-left mt-4 space-y-2">
              <li>All ProjectHub member benefits</li>
              <li>Share your resources with others and earn more</li>
              <li>Customize your profile and app icon</li>
              <li>Access to all exclusive features and tools</li>
              <li>Support the ProjectHub community with a larger contribution</li>
            </ul>
            <button className="mt-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Select Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
