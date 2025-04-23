'use client'

import React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const PaymentSuccess = () => {
  const params = useSearchParams()
  const transactionId = params.get('ref')
  const planName = params.get('plan')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-2">🎉 Payment Successful</h1>
      <p className="text-lg">You have successfully subscribed to the <strong>{planName}</strong> plan.</p>
      <p className="text-sm text-gray-500 mt-2">Transaction Ref: {transactionId}</p>

      <a href="/dashboard" className="mt-6 inline-block px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800">
        Go to Dashboard
      </a>
    </div>
  )
}

export default PaymentSuccess
