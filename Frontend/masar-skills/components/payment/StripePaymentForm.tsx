"use client";
import { useState, useEffect } from "react";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
interface Props {
  amount: number;
  onSuccess: (id: string) => void;
}
// Inner form component (wrapped by Elements)
function CheckoutForm({ amount, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/api/payment/success`,
        },
      });

      setLoading(false);

      if (error) {
        // Better error logging
        console.error("Payment error details:", {
          type: error.type,
          code: error.code,
          message: error.message,
          decline_code: error.decline_code,
          full_error: error,
        });

        // Show user-friendly error message
        alert(`Payment failed: ${error.message || "Unknown error"}`);
      } else if (paymentIntent?.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent.id);
        onSuccess(paymentIntent.id);
      } else {
        console.log("Payment status:", paymentIntent?.status);
      }
    } catch (err) {
      setLoading(false);
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
}

// Outer wrapper component (fetches clientSecret and provides Elements)
export default function StripePaymentForm({ amount, onSuccess }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!amount) return;

    const createPaymentIntent = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          body: JSON.stringify({ amount }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Failed to create payment intent:", error);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount]);

  return (
    <div className="space-y-4">
      {loading && !clientSecret && (
        <p className="text-gray-500 text-sm">Preparing secure payment…</p>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} />
        </Elements>
      )}
    </div>
  );
}