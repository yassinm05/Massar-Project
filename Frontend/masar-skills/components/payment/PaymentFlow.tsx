// components/payment/PaymentFlow.tsx
"use client";

import { useState } from "react";
import { Progress } from "../ui/progress";
import PlanSelection from "./PaymentSelection";
import StripeCheckout from "./StripeCheckout";
import PaymentConfirmation from "./PaymentConfirmation";
import PaymentSuccess from "./PaymentSuccess";
import { PaymentPlan, PaymentDetails, FormData } from "@/types/payment";

interface PaymentFlowProps {
  paymentDetails: PaymentDetails;
  paymentPlans: PaymentPlan;
}
export default function PaymentFlow({
  paymentDetails,
  paymentPlans,
}: PaymentFlowProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<FormData>>({
    courseId: paymentDetails.courseId,
    courseTitle: paymentDetails.courseTitle,
    instructorName: paymentDetails.instructorName,
    finalPrice: paymentDetails.finalPrice,
    discount: paymentDetails.discount,
    totalAmount: paymentDetails.originalPrice,
    howToPay: "",
    paymentMethod: "",
    amount: 0,
    transactionId: null,
    paymentDate: null,
  });

  const updateFormData = (name: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlanSelection = async (planType: string) => {
    const selectedOption = paymentPlans.options.find(
      (option) => option.type === planType
    );

    if (!selectedOption) return;

    updateFormData("howToPay", selectedOption.type);
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      console.log("💳 Processing payment with data:", {
        courseId: formData.courseId,
        amount: formData.amount,
        paymentMethod: formData.paymentMethod,
        paymentPlanType: formData.howToPay,
        transactionId,
      });

      // ✅ Call the new payment-success route
      const response = await fetch("/api/stripe/payment-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: formData.courseId,
          amount: formData.amount,
          paymentMethod: formData.paymentMethod,
          paymentPlanType: formData.howToPay,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.error || "Failed to process payment");
      }

      const data = await response.json();
      console.log("✅ Payment processed successfully:", data);

      // Update form data with transaction details
      setFormData((prev) => ({
        ...prev,
        transactionId: transactionId,
        paymentDate: new Date().toISOString(),
      }));

      // Move to confirmation step
      setStep(3);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ Error processing payment:", error);
        alert(
          `Failed to process payment: ${error.message}. Please contact support.`
        );
      } else {
        console.error("❌ Error processing payment:", error);
        alert("Failed to process payment. Please contact support.");
      }
    }
  };
  const progressValue = (step / 3) * 100;

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 max-sm:h-full">
        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-8">
            <p className="text-[#0D141C] font-medium mb-3">Step {step} of 3</p>
            <Progress value={progressValue} className="h-2" />
          </div>
        )}

        {/* Step Components */}
        {step === 1 && (
          <PlanSelection
            paymentPlans={paymentPlans}
            selectedPlan={formData.howToPay ?? ""}
            onSelect={handlePlanSelection}
            handleNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StripeCheckout
            formData={formData as FormData}
            handleSelection={updateFormData}
            handlePaymentSuccess={handlePaymentSuccess}
          />
        )}

        {step === 3 && (
          <PaymentConfirmation
            formData={formData as FormData}
            handleNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <PaymentSuccess
            courseTitle={formData.courseTitle as string}
            amount={formData.finalPrice as number}
            transactionId={formData.transactionId as string | null}
          />
        )}
      </div>
    </div>
  );
}
