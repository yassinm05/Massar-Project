import Image from "next/image";
import Successful from "@/public/assets/payment/successful.png";

interface PaymentSuccessfulProps {
  paymentAmount: number;
  courseTitle: string;
  transactionId: string | null;
}

export default function PaymentSuccessful({
  paymentAmount,
  courseTitle,
  transactionId,
}: PaymentSuccessfulProps) {
  return (
    <div className="w-full pt-[100px] flex flex-col gap-12 items-center px-[160px]">
      {/* Title and description */}
      <div className="flex flex-col gap-4 items-center">
        <p className="font-bold text-3xl">Payment Successful</p>
        <p className="text-sm text-[#47739E] text-center">
          Your payment has been successfully processed. You can now access your
          course.
        </p>
      </div>

      {/* Course details */}
      <div className="flex gap-4 self-start">
        <div className="w-12 h-12 relative">
          <Image src={Successful} alt="Payment successful checkmark" fill />
        </div>
        <div className="flex flex-col">
          <p className="font-medium">{courseTitle}</p>
          <p className="text-[#47739E] text-sm">
            Enrollment ID: {transactionId || "N/A"}
          </p>
        </div>
      </div>

      {/* Payment summary */}
      <div className="flex w-full justify-between">
        <p className="text-sm text-[#47739E]">Total</p>
        <p className="text-sm">${paymentAmount.toFixed(2)}</p>
      </div>

      {/* Action button */}
      <button
        className="self-start w-[480px] h-[40px] rounded-xl bg-[#0083AD] text-[#F7FAFC] font-bold text-sm hover:bg-[#007197] transition-colors"
        type="button"
      >
        Access Course
      </button>
    </div>
  );
}