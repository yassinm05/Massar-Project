import Payment from "@/public/assets/payment/payment.png";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import PaymentHandler from "./PaymentHandler";
import PaymentProvider from "./PaymentProvider";

interface PaymentDetails {
  courseTitle: string;
  instructorName: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  courseId: number;
}
interface pageProps {
  paymentDetails: PaymentDetails;
  handleSelect: (value, name) => void;
  paymentMethod: string;
  paymentPlan: string;
  handlePaymentSuccess: () => void;
}
export default function PaymentMethod({
  paymentDetails,
  handleSelect,
  paymentMethod,
  paymentPlan,
  handlePaymentSuccess,
}: pageProps) {
  return (
    <div className="flex gap-1 w-full">
      <div className="flex flex-col  gap-6 pt-12 w-2/3 ">
        <p className="font-bold text-[28px] text-[#0D252C]">Payment</p>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-[#0D252C]">
              Introduction to Patient Care
            </p>
            <p className="text-[#47739E] font-medium ">
              {paymentDetails.courseTitle}
            </p>
            <p className="text-sm text-[#47739E]">
              Instructor: {paymentDetails.instructorName}
            </p>
          </div>
          <div className="relative w-[289px] h-[154px] rounded-xl">
            <Image src={Payment} alt="" fill />
          </div>
        </div>
        <div className="flex  gap-6">
          <div className="flex flex-col gap-6">
            <div className="h-0 w-full border-b border-[#E5E7EB]"></div>
            <div className="flex flex-col">
              <p className="text-sm text-[#47739E]">Course Price</p>
              <p className="text-sm">${paymentDetails.originalPrice}</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-6">
            <div className="h-0 w-full border-b border-[#E5E7EB]"></div>
            <div className="flex flex-col">
              <p className="text-sm text-[#47739E]">Discount</p>
              <p className="text-sm">-${paymentDetails.discount}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="h-0 w-full border-b border-[#E5E7EB]"></div>
            <div className="flex flex-col">
              <p className="text-sm text-[#47739E]">Total</p>
              <p className="text-sm">${paymentDetails.finalPrice}</p>
            </div>
          </div>
        </div>
        <p className="text-[#47739E] text-sm">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
      <div className="w-1/3 py-5 px-4 flex flex-col gap-6">
        <p className="font-bold text-2xl text-[#0D141C]">Payment method</p>
        <div>
          <div className="flex flex-col gap-3">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => handleSelect("paymentMethod", value)}
              defaultValue="fullAmount"
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
                  <p className="font-medium text-sm text-[#0D141C]">Paypal</p>
                </div>
                <RadioGroupItem value="paypal" id="paypal" />
              </label>
              <label
                htmlFor="apple"
                className="flex justify-between p-4 items-center border border-[#CFDBE8] rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-sm text-[#0D141C]">apple Pay</p>
                <RadioGroupItem value="apple" id="apple" />
              </label>
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-4 ">
            <div className="flex flex-col gap-6">
              <PaymentProvider>
                <PaymentHandler
                  paymentMethod={paymentMethod}
                  amount={paymentDetails.finalPrice}
                  courseId={paymentDetails.courseId}
                  paymentPlanType={paymentPlan}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </PaymentProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
