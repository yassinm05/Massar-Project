import Image from "next/image";
import Successful from "@/public/assets/payment/successful.png";

export default function PaymentSuccessful({
  paymentAmount,
  courseTitle,
  transactionId,
}) {
  return (
    <div className="w-full pt-[100px] flex flex-col gap-12 items-center px-[160px]">
      <div className="flex flex-col gap-4 items-center"> 
        <p className="font-bold text-3xl">Payment Successful</p>
        <p className="text-sm text-[#47739E]">
          Your payment has been successfully processed. You can now access your
          course.
        </p>
      </div>
      <div className="flex gap-4 self-start">
        <div className="w-12 h-12 relative">
          <Image src={Successful} alt="" fill />
        </div>
        <div className="flex flex-col ">
          <p className="font-medium">{courseTitle}</p>
          <p className="text-[#47739E] text-sm">Enrollment {transactionId}</p>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <p className="text-sm text-[#47739E]">Total</p>
        <p className="text-sm">${paymentAmount}</p>
      </div>
      <button className="self-start w-[480px] h-[40px] rounded-xl bg-[#0083AD] text-[#F7FAFC] font-bold text-sm">Access Course</button>
    </div>
  );
}
