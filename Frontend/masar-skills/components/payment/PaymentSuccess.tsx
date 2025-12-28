// components/payment/steps/PaymentSuccess.tsx
"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentSuccessProps {
  courseTitle: string;
  amount: number;
  transactionId: string | null;
}

export default function PaymentSuccess({
  courseTitle,
  amount,
  transactionId,
}: PaymentSuccessProps) {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="flex flex-col items-center gap-4">
        <CheckCircle className="w-20 h-20 text-green-500" />
        <h1 className="text-3xl font-bold text-[#0D141C]">
          Payment Successful!
        </h1>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-lg text-[#47739E]">Thank you for your purchase</p>
        <p className="text-[#0D141C] font-medium">
          You have successfully enrolled in
        </p>
        <p className="text-xl font-bold text-[#0D141C]">{courseTitle}</p>
      </div>

      <div className="flex flex-col items-center gap-2 bg-gray-50 p-6 rounded-xl">
        <p className="text-sm text-[#47739E]">Amount Paid</p>
        <p className="text-2xl font-bold text-[#0D141C]">${amount}</p>
        {transactionId && (
          <>
            <p className="text-xs text-[#47739E] mt-2">Transaction ID</p>
            <p className="text-xs font-mono text-[#0D141C]">{transactionId}</p>
          </>
        )}
      </div>

      <div className="flex gap-4 mt-6 max-sm:flex-col">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-[#0083AD] text-white font-bold rounded-xl hover:bg-[#006B8F] transition-colors"
        >
          Go to My Courses
        </button>
        <button
          onClick={() => router.push("/course-catalog")}
          className="px-6 py-3 border border-[#0083AD] text-[#0083AD] font-bold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Browse More Courses
        </button>
      </div>
    </div>
  );
}