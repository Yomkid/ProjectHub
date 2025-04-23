'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'

const Checkout = () => {
  const params = useSearchParams()
  const router = useRouter()
  const planId = params.get('plan_id')
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '' })

  useEffect(() => {
    if (planId) {
      axios.get(`/api/plans/${planId}`) // Replace with your FastAPI route later
        .then(res => {
          setPlan(res.data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [planId])

  const handlePay = () => {
    if (!form.email || !form.name) {
      alert("Please fill in your name and email.")
      return
    }

    //@ts-ignore
    FlutterwaveCheckout({
      public_key: 'FLWPUBK_TEST-xxxxxxxxxxxxx-X', // Replace with your real key
      tx_ref: `PH-${Date.now()}`,
      amount: plan.price,
      currency: 'NGN',
      customer: {
        email: form.email,
        name: form.name,
      },
      customizations: {
        title: 'ProjectHub',
        description: `Subscription for ${plan.name}`,
        logo: '/logo.png',
      },
      callback: (response: any) => {
        // Optionally send to FastAPI
        router.push(`/payment-success?ref=${response.transaction_id}&plan=${plan.name}`)
      },
      onclose: () => {
        console.log('Payment closed')
      },
    });
  }

  if (loading) return <p className="text-center py-20">Loading plan...</p>
  if (!plan) return <p className="text-center text-red-500 py-20">Plan not found</p>

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow mt-10 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout - {plan.name}</h2>

      <div className="mb-4">
        <p className="text-xl font-semibold">₦{plan.price.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{plan.billing_cycle} billing</p>
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
