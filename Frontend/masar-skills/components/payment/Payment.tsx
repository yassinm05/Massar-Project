"use client";

import { useEffect, useState } from "react";
import HowToPay from "./HowToPay";
import { Progress } from "../ui/progress";
import PaymentMethod from "./PaymentMethod";
import handlePaymentAction, {
  getPaymentDetailsAction,
} from "@/actions/payment-action";
import PaymentMethodWrapper from "./PaymentMethodWrapper";
import PaymentDetails from "./PaymentDetails";
import PaymentSuccessful from "./PaymentSuccessful";

export default function Payment({ paymentPlans }) {
  const [step, setStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState();
  const [formData, setFormData] = useState({
  courseId: paymentPlans.courseId,
  courseTitle: paymentPlans.courseTitle,
  howToPay: "",
  paymentMethod: "",
  amount: 0,
  AutoRenew: false,
  transactionId: null as string | null,  // Add type annotation
  renewDate: null as string | null,      // Add type annotation
});
  const handleSelection = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePaymentSuccess = (transactionId: string, renewDate: string) => {
    setFormData(prev => ({
      ...prev,
      transactionId,
      renewDate,
    }));

    setStep(3); // This navigates to the next step
  };
  const handleNext = async () => {
    if (step === 1) {
      if (formData.howToPay) {
        const result = await getPaymentDetailsAction(formData.courseId);
        setPaymentDetails(result.data);
        setStep(2);
      } else {
        alert(`Please fill all fields on Step 1 $`);
      }
    }
    if (step == 2) {
      if (formData.transactionId && formData.renewDate) {
        setStep(3);
      } else {
        alert(
          `Please complete the transaction first ${formData.transactionId} ${formData.renewDate} `
        );
      }
    }
    if (step === 3) {
      setStep(4);
    }
  };

  return (
    <div
      className={` bg-[#F9FAFB] min-h-screen flex justify-center pt-12 ${
        step === 2 ? "px-10" : "px-[200px]"
      }`}
    >
      <div className={`relative flex gap-9  w-full`}>
        <div
          className={`absolute ${
            step === 2 ? "w-2/3" : "w-full"
          } top-0 left-0 flex flex-col gap-3 ${step===4?"hidden":""}`}
        >
          <p className="text-[#0D141C] font-medium">step {step} of 3</p>
          <div className="w-full h-2">
            <Progress
              value={100 / (4 - step)}
              className2="bg-[#0083AD]"
              className="bg-[#9FE7FF]"
            />
          </div>
        </div>
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
        {step===4 &&(
          <PaymentSuccessful paymentAmount={formData.amount} courseTitle={formData.courseTitle} transactionId={formData.transactionId} />
        )}
      </div>
    </div>
  );
}
