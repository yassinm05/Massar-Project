// components/payment/PlanSelection.tsx
"use client";

import { PaymentPlan } from "@/types/payment";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";

interface PlanSelectionProps {
  paymentPlans: PaymentPlan;
  selectedPlan: string;
  onSelect: (planType: string) => void;
  handleNext:()=>void
}

export default function PlanSelection({
  paymentPlans,
  selectedPlan,
  onSelect,
  handleNext
}: PlanSelectionProps) {
  const [selected, setSelected] = useState(selectedPlan);

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
      handleNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#0D141C] mb-8">
        Choose a Payment Plan
      </h1>

      <RadioGroup value={selected} onValueChange={setSelected}>
        <div className="space-y-4">
          {paymentPlans.options.map((option) => (
            <label
              key={option.type}
              htmlFor={option.type}
              className="flex justify-between p-4 items-center border border-[#CFDBE8] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-[#0D141C]">
                  {option.displayText}
                </p>
                <p className="text-sm text-[#47739E]">
                  ${option.amountPerInstallment}
                  {option.numberOfInstallments && option.numberOfInstallments > 1
                    ? ` × ${option.numberOfInstallments} payments`
                    : ""}
                </p>
              </div>
              <RadioGroupItem value={option.type} id={option.type} />
            </label>
          ))}
        </div>
      </RadioGroup>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="bg-[#0083AD] px-6 py-3 text-white font-bold rounded-xl hover:bg-[#006B8F] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}