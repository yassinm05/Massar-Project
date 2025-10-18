import Image from "next/image";
import Payment from "@/public/assets/payment/payment.png";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import PaymentHandler from "./PaymentHandler";
import PaymentProvider from "./PaymentProvider";

// Define the structure of the payment details to match PaymentDetailsType
interface PaymentDetails {
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

// Define the props for the component
interface PaymentMethodProps {
  paymentDetails: PaymentDetails | null;
  handleSelect: (name: string, value: string | number | boolean) => void;
  paymentMethod: PaymentMethodType | "";
  paymentPlan: string;
  handlePaymentSuccess: (transactionId: string, renewDate: string) => void;
}

export default function PaymentMethod({
  paymentDetails,
  handleSelect,
  paymentMethod,
  paymentPlan,
  handlePaymentSuccess,
}: PaymentMethodProps) {
  // Handle null paymentDetails
  if (!paymentDetails) {
    return (
      <div className="flex items-center justify-center w-full p-12">
        <p className="text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  // Type guard to check if payment method is valid
  const isValidPaymentMethod = (
    method: string
  ): method is PaymentMethodType => {
    return method === "credit" || method === "paypal" || method === "apple";
  };

  return (
    <div className="flex gap-1 w-full">
      {/* LEFT SIDE: Course and pricing details */}
      <div className="flex flex-col gap-6 pt-12 w-2/3">
        <p className="font-bold text-[28px] text-[#0D252C]">Payment</p>

        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-[#0D252C]">
              Introduction to Patient Care
            </p>
            <p className="text-[#47739E] font-medium">
              {paymentDetails.courseTitle || "Course Title"}
            </p>
            <p className="text-sm text-[#47739E]">
              Instructor: {paymentDetails.instructorName || "N/A"}
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
              <p className="text-sm">
                ${paymentDetails.originalPrice || paymentDetails.amount}
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col gap-6">
            <div className="h-0 w-full border-b border-[#E5E7EB]" />
            <div className="flex flex-col">
              <p className="text-sm text-[#47739E]">Discount</p>
              <p className="text-sm">-${paymentDetails.discount || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="h-0 w-full border-b border-[#E5E7EB]" />
            <div className="flex flex-col">
              <p className="text-sm text-[#47739E]">Total</p>
              <p className="text-sm">
                ${paymentDetails.finalPrice || paymentDetails.amount}
              </p>
            </div>
          </div>
        </div>

        <p className="text-[#47739E] text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      {/* RIGHT SIDE: Payment method and handler */}
      <div className="w-1/3 py-5 px-4 flex flex-col gap-6">
        <p className="font-bold text-2xl text-[#0D141C]">Payment method</p>

        <div>
          <div className="flex flex-col gap-3">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => handleSelect("paymentMethod", value)}
              defaultValue="credit"
            >
              <label
                htmlFor="credit"
                className="flex justify-between p-4 items-center border border-[#CFDBE8] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col">
                  <p className="font-medium text-sm text-[#0D141C]">
                    Credit Card
                  </p>
                </div>
                <RadioGroupItem value="credit" id="credit" />
              </label>

              <label
                htmlFor="paypal"
                className="flex justify-between p-4 items-center border border-[#CFDBE8] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col">
                  <p className="font-medium text-sm text-[#0D141C]">PayPal</p>
                </div>
                <RadioGroupItem value="paypal" id="paypal" />
              </label>

              <label
                htmlFor="apple"
                className="flex justify-between p-4 items-center border border-[#CFDBE8] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-sm text-[#0D141C]">Apple Pay</p>
                <RadioGroupItem value="apple" id="apple" />
              </label>
            </RadioGroup>
          </div>

          {/* Only render PaymentHandler if a valid payment method is selected */}
          {paymentMethod && isValidPaymentMethod(paymentMethod) && (
            <div className="flex flex-col gap-4 mt-6">
              <PaymentProvider>
                <PaymentHandler
                  paymentMethod={paymentMethod}
                  amount={paymentDetails.finalPrice || paymentDetails.amount}
                  courseId={paymentDetails.courseId || 0}
                  paymentPlanType={paymentPlan}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </PaymentProvider>
            </div>
          )}

          {/* Show message if no payment method selected */}
          {!paymentMethod && (
            <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm text-center">
              Please select a payment method above
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
