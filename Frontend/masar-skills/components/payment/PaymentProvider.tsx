// components/PaymentProvider.tsx
'use client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface PaymentProviderProps {
  children: ReactNode;
}

export default function PaymentProvider({ children }: PaymentProviderProps) {
  // Important: Ensure consistent configuration
  const paypalOptions = {
    clientId: paypalClientId || '',
    currency: "USD",
    intent: "capture", // Must be lowercase
    components: "buttons",
    // Add these for better debugging
    debug: true,
    disableFunding: ["credit", "card"], // Optional: disable credit for testing
    locale: "en_US"
  };

  if (!stripePromise || !paypalClientId) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        <p>Payment system is not configured properly.</p>
        {!stripeKey && <p className="text-sm">Missing: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</p>}
        {!paypalClientId && <p className="text-sm">Missing: NEXT_PUBLIC_PAYPAL_CLIENT_ID</p>}
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PayPalScriptProvider 
        options={paypalOptions}
        deferLoading={false}
      >
        {children}
      </PayPalScriptProvider>
    </Elements>
  );
}