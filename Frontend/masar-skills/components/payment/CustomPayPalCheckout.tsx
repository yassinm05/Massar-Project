"use client";

import { useState } from "react";

export default function CustomPayPalCheckout({ amount, courseId, onSuccess }) {
  const [paymentIntentId, setPaymentIntentId] = useState("");

  async function startStripeIntent() {
    const res = await fetch("/api/create-paypal-payment-intent", {
      method: "POST",
      body: JSON.stringify({ amount, courseId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setPaymentIntentId(data.paymentIntentId);
    return data.paymentIntentId;
  }

  async function handlePay() {
    const intentId = paymentIntentId || (await startStripeIntent());

    // -----------------------
    // PAYPAL POPUP SIMULATION
    // Replace with real PayPal JS SDK
    // -----------------------
    const fakePayPal = await new Promise((resolve) => {
      setTimeout(
        () => resolve({ status: "COMPLETED", id: "PAYPAL_TXN_123" }),
        1500
      );
    });

    if (fakePayPal.status !== "COMPLETED") return;

    await fetch("/api/confirm-custom-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId: intentId,
        transactionId: fakePayPal.id,
      }),
    });

    onSuccess(intentId);
  }

  return (
    <button
      onClick={handlePay}
      className="bg-yellow-400 text-black py-2 px-4 rounded-lg"
    >
      Pay with PayPal
    </button>
  );
}
