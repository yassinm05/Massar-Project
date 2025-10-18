"use client";

import React from "react";

interface FormDataType {
  courseId: number;
  courseTitle: string;
  howToPay: string;
  paymentMethod: string;
  amount: number;
  AutoRenew: boolean;
  transactionId: string | null;
  renewDate: string | null;
}

interface PaymentDetailsProps {
  formData: FormDataType;
  handleNext: () => void;
}

export default function PaymentDetails({
  formData,
  handleNext,
}: PaymentDetailsProps) {
  return (
    <div className="w-full flex flex-col gap-9 pt-16">
      <p className="text-[#0D141C] font-bold text-3xl">Payment Details</p>

      {/* Payment method */}
      <div className="flex gap-6">
        <div className="w-10 h-6 bg-white border border-[#C4C4C4] rounded-[3.5px]" />
        <div>{formData.paymentMethod}</div>
      </div>

      {/* Next payment + renewal info */}
      <div className="flex gap-8">
        <div className="flex flex-col gap-7">
          <div className="h-0 w-full border-b border-[#E5E7EB]" />
          <div>
            <p className="text-sm text-[#47739E]">Next Payment</p>
            <p className="text-sm">{formData.renewDate ?? "N/A"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-7">
          <div className="h-0 w-full border-b border-[#E5E7EB]" />
          <div>
            <p className="text-sm text-[#47739E]">Renewal</p>
            <p className="text-sm">
              {formData.AutoRenew ? "Monthly" : "Manual"}
            </p>
          </div>
        </div>
      </div>

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
        className="w-[480px] h-12 rounded-xl bg-[#0083AD] flex justify-center items-center text-[#F7FAFC] font-bold hover:cursor-pointer"
        onClick={handleNext}
      >
        Complete
      </button>
    </div>
  );
}
