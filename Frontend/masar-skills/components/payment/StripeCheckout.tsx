"use client";

import PayPalPaymentForm from "./PayPalPaymentForm";
import StripePaymentForm from "./StripePaymentForm";
import { FormData } from "@/types/payment";
import Payment from "@/public/assets/payment/payment.png";
import Image from "next/image";

interface PaymentCheckoutProps {
  formData: FormData;
  handleSelection: (name: string, value: string) => void;
  handlePaymentSuccess: (transactionId: string) => void;
}

export default function PaymentCheckout({
  formData,
  handleSelection,
  handlePaymentSuccess,
}: PaymentCheckoutProps) {
  const selected = formData.paymentMethod;

  return (
    <div className="flex gap-1 w-full max-sm:flex-col">
      {/* LEFT SIDE: Course and pricing details */}
      <div className="flex flex-col gap-6 pt-12 w-2/3 max-sm:w-full">
        <p className="font-bold text-[28px] text-[#0D252C]">Payment</p>

        <div className="flex justify-between max-sm:flex-col max-sm:gap-4">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-[#0D252C]">
              Introduction to Patient Care
            </p>
            <p className="text-[#47739E] font-medium">
              {formData.courseTitle || "Course Title"}
            </p>
            <p className="text-sm text-[#47739E]">
              Instructor: {formData.instructorName || "N/A"}
            </p>
          </div>

          <div className="relative w-[289px] h-[154px] rounded-xl">
            <Image src={Payment} alt="Payment illustration" fill />
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="flex gap-6">
          <div className="flex flex-col gap-6">
            <div className="h-0 w-full border-b border-[#E5E7EB]" />
            <div className="flex flex-col">
              <p className="text-sm text-[#47739E]">Course Price</p>
              <p className="text-sm">${formData.totalAmount}</p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
            <div className="h-0 w-full border-b border-[#E5E7EB]" />
            <div className="flex flex-col">
              <p className="text-sm text-[#47739E]">Discount</p>
              <p className="text-sm">-${formData.discount || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="h-0 w-full border-b border-[#E5E7EB]" />
            <div className="flex flex-col">
              <p className="text-sm text-[#47739E]">Total</p>
              <p className="text-sm">${formData.finalPrice}</p>
            </div>
          </div>
        </div>

        <p className="text-[#47739E] text-sm max-sm:hidden">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* right side … payment method*/}

      <div className="w-1/3 py-5 px-4 flex flex-col gap-6 max-sm:w-full max-sm:px-0">
        <p className="font-bold text-2xl">Payment method</p>

        {/* PAYMENT METHOD RADIO */}
        <div className="flex flex-col gap-3">
          {/* CARD */}
          <div
            className={`border p-4 rounded-xl cursor-pointer transition-all ${
              selected === "card"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => handleSelection("paymentMethod", "card")}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selected === "card" ? "border-blue-500" : "border-gray-300"
                }`}
              >
                {selected === "card" && (
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                )}
              </div>
              <p className="font-medium">Credit Card</p>
            </div>
          </div>

          {/* PAYPAL */}
          <div
            className={`border p-4 rounded-xl cursor-pointer transition-all ${
              selected === "paypal"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => handleSelection("paymentMethod", "paypal")}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selected === "paypal" ? "border-blue-500" : "border-gray-300"
                }`}
              >
                {selected === "paypal" && (
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                )}
              </div>
              <p className="font-medium">PayPal</p>
            </div>
          </div>

          {/* APPLE PAY */}
          <div
            className={`border p-4 rounded-xl cursor-pointer transition-all ${
              selected === "applePay"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => handleSelection("paymentMethod", "applePay")}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selected === "applePay"
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selected === "applePay" && (
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                )}
              </div>
              <p className="font-medium">Apple Pay</p>
            </div>
          </div>
        </div>

        {/* DISPLAY SECTIONS */}

        {selected === "card" && (
          <div className="mt-4">
            <StripePaymentForm
              amount={formData.finalPrice}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}

        {selected === "paypal" && (
          <div className="mt-4">
            <div className="mt-4">
              {/* 2. Render the PayPal Component */}
              <PayPalPaymentForm
                amount={formData.finalPrice}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        )}

        {selected === "applePay" && (
          <div className="mt-4">
            {/* <ApplePayButton amount={paymentDetails.finalPrice} /> */}
            coming soon...
          </div>
        )}
      </div>
    </div>
  );
}