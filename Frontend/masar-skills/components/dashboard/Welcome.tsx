import Image from "next/image";
import student from '@/public/assets/dashboard/Welcome/student.png'

interface WelcomeProps {
  firstName: string;
}

export default function Welcome({ firstName }: WelcomeProps) {
  return (
    <section className="rounded-[10px] h-40 max-sm:h-full py-6 px-10 max-sm:px-4 flex max-sm:flex-col justify-between items-center bg-[#F0FBFF]">
      <div className="flex flex-col h-full justify-evenly max-sm:items-center max-sm:gap-4 ">
        <p className="font-bold text-3xl">Welcome Back, {firstName}!</p>
        <div className="relative w-24 h-24 rounded-full sm:hidden">
          <Image src={student} alt="" fill />
        </div>
        <p className="text-lg max-sm:text-center">
          Your journey to becoming a nursing assistant continues.
        </p>
      </div>
      <div className="relative max-sm:hidden w-28 h-28 rounded-full">
        <Image src={student} alt="" fill />
      </div>
    </section>
  );
}
