'use client'

import React, { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const Checkout = () => {
  const params = useSearchParams()
  const router = useRouter()

  const title = params.get('title')
  const priceString = params.get('price') || ''
  const billingCycle = params.get('cycle') || 'yearly'

  const price = Number(priceString.replace(/[^\d]/g, '')) // extract just the number
  const [form, setForm] = useState({ name: '', email: '' })

  const handlePay = () => {
    if (!form.email || !form.name) {
      alert("Please fill in your name and email.")
      return
    }

    //@ts-ignore
    FlutterwaveCheckout({
      public_key: 'FLWPUBK_TEST-xxxxxxxxxxxxx-X',
      tx_ref: `PH-${Date.now()}`,
      amount: price,
      currency: 'NGN',
      customer: {
        email: form.email,
        name: form.name,
      },
      customizations: {
        title: 'ProjectHub',
        description: `Subscription for ${title}`,
        logo: '/logo.png',
      },
      callback: (response: any) => {
        router.push(`/payment-success?ref=${response.transaction_id}&plan=${title}`)
      },
      onclose: () => {
        console.log('Payment closed')
      },
    });
  }

  if (!title || !price) return <p className="text-center text-red-500 py-20">Invalid or missing plan info</p>

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow mt-10 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout - {title}</h2>

      <div className="mb-4">
        <p className="text-xl font-semibold">₦{price.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{billingCycle} billing</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border px-3 py-2 mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <button
        onClick={handlePay}
        className="w-full bg-green-600 text-white py-2 mt-4 hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  )
}

export default Checkout
