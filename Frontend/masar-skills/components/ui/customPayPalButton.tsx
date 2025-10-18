import { useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface CustomPayPalButtonProps {
  createPayPalOrder: () => Promise<string>;
  onPayPalApprove: (data: unknown) => Promise<void>;
  processing: boolean;
}

export default function CustomPayPalButton({
  createPayPalOrder,
  onPayPalApprove,
  processing,
}: CustomPayPalButtonProps) {
  const [{ isResolved }] = usePayPalScriptReducer();
  const [showPayPal, setShowPayPal] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Step 1 — Custom styled PayPal trigger */}
      {!showPayPal && (
        <button
          onClick={() => setShowPayPal(true)}
          disabled={processing}
          className="h-[48px] flex justify-center items-center rounded-xl bg-[#0083AD] text-[#F7FAFC] font-bold hover:bg-[#006B8F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? "Processing..." : "Pay with PayPal"}
        </button>
      )}

      {/* Step 2 — Official PayPal button (hidden until user clicks) */}
      {showPayPal && isResolved && (
        <div className="rounded-xl overflow-hidden">
          <PayPalButtons
            createOrder={createPayPalOrder}
            onApprove={onPayPalApprove}
            style={{
              layout: "vertical",
              shape: "rect",
              color: "gold",
              label: "paypal",
              height: 48,
            }}
          />
        </div>
      )}
    </div>
  );
}
