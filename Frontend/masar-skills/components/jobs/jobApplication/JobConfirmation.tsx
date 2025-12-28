import Image from "next/image";
import Confirm from "@/public/assets/jobs/confirm.png";

interface JobConfirmationProps {
  confirmationNumber: string | number;
}

export default function JobConfirmation({
  confirmationNumber,
}: JobConfirmationProps) {
  return (
    <div className="w-[670px] h-[670px] bg-white rounded-lg shadow p-8 text-center flex justify-center items-center max-sm:w-full max-sm:px-4 max-sm:py-0">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-col gap-6 justify-center items-center">
          <div className="relative w-[120px] h-[120px] rounded-full">
            <Image src={Confirm} alt="Confirmation check icon" fill />
          </div>
          <p className="font-extrabold text-2xl">Thank You For Applying!</p>
          <p className="text-[#565D6D] max-w-[45ch] text-center">
            Your application has been successfully submitted. We appreciate your
            interest in joining our team.
          </p>
        </div>

        <div className="w-[457px] h-[110px] flex flex-col justify-center items-center gap-4 bg-[#F8FAFC] border border-[#EAEEF4] max-sm:w-full  ">
          <p className="text-[#576474]">Confirmation Number</p>
          <p className="font-bold text-[#1F2937] text-2xl">
            {confirmationNumber}
          </p>
        </div>

        <p className="text-[#576474]">
          We&apos;ll review your application and contact you within{" "}
          <span className="text-[#1F2937] font-semibold">5 business days</span>{" "}
          with the next steps.
        </p>
      </div>
    </div>
  );
}
