"use client";

import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

interface PayPalPaymentFormProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
}

export default function PayPalPaymentForm({ amount, onSuccess }: PayPalPaymentFormProps) {
  
  // Configure options here
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", // Ensure this is in your .env.local
    currency: "USD",
    intent: "capture",
  };

  return (
    <div className="w-full">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
        fundingSource={FUNDING.PAYPAL}
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    value: amount.toString(), // Convert number to string for PayPal
                    currency_code: "USD",
                  },
                  description: "Course Purchase", 
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (actions.order) {
                const order = await actions.order.capture();
                // Pass the Transaction ID back to your parent component
                onSuccess(order.id || "");
            }
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            // Optionally handle error state here
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}