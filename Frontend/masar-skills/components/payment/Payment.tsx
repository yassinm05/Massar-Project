"use client";

import { useState } from "react";
import HowToPay from "./HowToPay";
import { Progress } from "../ui/progress";
import PaymentMethod from "./PaymentMethod";
import { getPaymentDetailsAction } from "@/actions/payment-action";
import PaymentDetails from "./PaymentDetails";
import PaymentSuccessful from "./PaymentSuccessful";

// ---------- TYPES ----------
interface PaymentOption {
  type: string;
  displayText: string;
  amountPerInstallment: number;
  numberOfInstallments?: number;
}

interface PaymentPlan {
  courseId: number;
  courseTitle: string;
  options: PaymentOption[];
}

interface PaymentDetailsType {
  id: number;
  amount: number;
  currency: string;
  courseTitle?: string;
  instructorName?: string;
  originalPrice?: number;
  discount?: number;
  finalPrice?: number;
  courseId?: number;
}

// Define payment method type
type PaymentMethodType = "credit" | "paypal" | "apple";

interface FormDataType {
  courseId: number;
  courseTitle: string;
  howToPay: string;
  paymentMethod: PaymentMethodType | ""; // Allow empty string for initial state
  amount: number;
  AutoRenew: boolean;
  transactionId: string | null;
  renewDate: string | null;
  numberOfInstallments?: number;
  totalAmount?: number;
}

// ---------- COMPONENT ----------
interface PaymentProps {
  paymentPlans: PaymentPlan;
}

export default function Payment({ paymentPlans }: PaymentProps) {
  const [step, setStep] = useState<number>(1);
  const [paymentDetails, setPaymentDetails] =
    useState<PaymentDetailsType | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    courseId: paymentPlans.courseId,
    courseTitle: paymentPlans.courseTitle,
    howToPay: "",
    paymentMethod: "",
    amount: 0,
    AutoRenew: false,
    transactionId: null,
    renewDate: null,
  });

  // ---------- HANDLERS ----------
  const handleSelection = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSuccess = (transactionId: string, renewDate: string) => {
    setFormData((prev) => ({
      ...prev,
      transactionId,
      renewDate,
    }));

    setStep(3);
  };

  const handleNext = async () => {
    if (step === 1) {
      if (formData.howToPay) {
        const result = await getPaymentDetailsAction(formData.courseId);
        setPaymentDetails(result.data as PaymentDetailsType);
        setStep(2);
      } else {
        alert("Please fill all fields on Step 1");
      }
    } else if (step === 2) {
      if (formData.transactionId && formData.renewDate) {
        setStep(3);
      } else {
        alert(
          `Please complete the transaction first (${formData.transactionId} ${formData.renewDate})`
        );
      }
    } else if (step === 3) {
      setStep(4);
    }
  };

  // ---------- RENDER ----------
  return (
    <div
      className={`bg-[#F9FAFB] min-h-screen flex justify-center pt-12 ${
        step === 2 ? "px-10" : "px-[200px]"
      }`}
    >
      <div className={`relative flex gap-9 w-full`}>
        {/* Progress bar */}
        <div
          className={`absolute ${
            step === 2 ? "w-2/3" : "w-full"
          } top-0 left-0 flex flex-col gap-3 ${step === 4 ? "hidden" : ""}`}
        >
          <p className="text-[#0D141C] font-medium">Step {step} of 3</p>
          <div className="w-full h-2">
            <Progress
              value={100 / (4 - step)}
              className2="bg-[#0083AD]"
              className="bg-[#9FE7FF]"
            />
          </div>
        </div>

        {/* Step content */}
        {step === 1 && (
          <HowToPay
            handleSelection={handleSelection}
            handleNext={handleNext}
            selectedValue={formData.howToPay}
            paymentPlans={paymentPlans}
          />
        )}

        {step === 2 && (
          <PaymentMethod
            handlePaymentSuccess={handlePaymentSuccess}
            handleSelect={handleSelection}
            paymentMethod={formData.paymentMethod}
            paymentDetails={paymentDetails}
            paymentPlan={formData.howToPay}
          />
        )}

        {step === 3 && (
          <PaymentDetails formData={formData} handleNext={handleNext} />
        )}

        {step === 4 && (
          <PaymentSuccessful
            paymentAmount={formData.amount}
            courseTitle={formData.courseTitle}
            transactionId={formData.transactionId}
          />
        )}
      </div>
    </div>
  );
}