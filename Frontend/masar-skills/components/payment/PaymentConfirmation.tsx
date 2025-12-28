// components/payment/steps/PaymentConfirmation.tsx
"use client";

import React from "react";
import { FormData } from "@/types/payment";

interface PaymentConfirmationProps {
  formData: FormData;
  handleNext: () => void;
}

export default function PaymentConfirmation({
  formData,
  handleNext,
}: PaymentConfirmationProps) {
  const getPaymentMethodDisplay = () => {
    switch (formData.paymentMethod) {
      case "card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "applePay":
        return "Apple Pay";
      default:
        return formData.paymentMethod;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getNextPaymentDate = () => {
    if (!formData.paymentDate) return "N/A";
    const date = new Date(formData.paymentDate);
    date.setMonth(date.getMonth() + 1);
    return formatDate(date.toISOString());
  };

  return (
    <div className="w-full flex flex-col gap-9 pt-16">
      <p className="text-[#0D141C] font-bold text-3xl">Payment Details</p>

      {/* Payment method */}
      <div className="flex gap-6 items-center w-full ">
        <div className="w-10 h-6 bg-white border border-[#C4C4C4] rounded-[3.5px]" />
        <div className="font-medium">{getPaymentMethodDisplay()}</div>
      </div>

      {/* Transaction Details */}
      <div className="flex gap-8 w-full">
        <div className="flex flex-col gap-7 max-sm:w-1/2">
          <div className="h-0 w-full border-b border-[#E5E7EB]" />
          <div className="w-full">
            <p className="text-sm text-[#47739E]">Transaction ID</p>
            <p className="text-sm font-mono w-full break-all">
              {formData.transactionId || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-7 max-sm:w-1/2">
          <div className="h-0 w-full border-b border-[#E5E7EB]" />
          <div>
            <p className="text-sm text-[#47739E]">Payment Date</p>
            <p className="text-sm">{formatDate(formData.paymentDate)}</p>
          </div>
        </div>
      </div>

      {/* Next payment if installments */}
      {formData.numberOfInstallments && formData.numberOfInstallments > 1 && (
        <div className="flex gap-8">
          <div className="flex flex-col gap-7">
            <div className="h-0 w-full border-b border-[#E5E7EB]" />
            <div>
              <p className="text-sm text-[#47739E]">Next Payment</p>
              <p className="text-sm">{getNextPaymentDate()}</p>
            </div>
          </div>

          <div className="flex flex-col gap-7">
            <div className="h-0 w-full border-b border-[#E5E7EB]" />
            <div>
              <p className="text-sm text-[#47739E]">Remaining Installments</p>
              <p className="text-sm">{formData.numberOfInstallments - 1}</p>
            </div>
          </div>
        </div>
      )}

      {/* Course recap */}
      <div className="flex flex-col gap-8">
        <p className="font-bold text-2xl">Course Recap</p>
        <div>
          <p className="font-medium">{formData.courseTitle}</p>
          <p className="text-sm text-[#47739E]">1 course</p>
        </div>
      </div>

      {/* Complete button */}
      <button
        className="w-[480px] h-12 rounded-xl bg-[#0083AD] flex justify-center items-center text-[#F7FAFC] font-bold hover:bg-[#006B8F] transition-colors max-sm:w-full"
        onClick={handleNext}
      >
        Complete
      </button>
    </div>
  );
}