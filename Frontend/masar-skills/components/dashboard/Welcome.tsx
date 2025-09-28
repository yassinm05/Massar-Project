import Image from "next/image";
import student from '@/public/assets/dashboard/Welcome/student.png'

interface WelcomeProps {
  firstName: string;
}

export default function Welcome({ firstName }: WelcomeProps) {
  return (
    <section className="rounded-[10px] h-40 py-6 px-10 flex justify-between items-center bg-[#F0FBFF]">
      <div className="flex flex-col h-full justify-evenly ">
        <p className="font-bold text-4xl">Welcome Back, {firstName}!</p>
        <p className="text-lg">Your journey to becoming a nursing assistant continues.</p>
      </div>
      <div className="relative w-28 h-28 rounded-full">
        <Image src={student}  alt="" fill/>
      </div>
    </section>
  );
}
