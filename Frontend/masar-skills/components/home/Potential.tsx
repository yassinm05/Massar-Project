import Image from "next/image";
import Link from "next/link";
import dashBoard from "@/public/assets/home/Potential/Personalized student dashboard.png";
import certificates from "@/public/assets/home/Potential/Student receiving a certificate.png";
import support from "@/public/assets/home/Potential/Healthcare professionals in a meeting.png";
import arrow from '@/public/assets/home/Potential/arrow.png';


export default function Potential() {
  return (
    <section className="h-[804px] pt-28 px-16 flex flex-col gap-16 items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-4xl leading-10 text-center">
        Unlock Your Potential with Masar Skills
      </h1>
      <p className="w-[716px] text-lg leading-7 text-[#6B7280] text-center">
        Experience a transformative learning journey with our extensive catalog
        of accredited courses, providing the skills and certifications needed
        for success.
      </p>
      </div>
      <div className="flex gap-8 justify-between w-full">
        <div className="flex flex-col w-[400px] h-[346px] justify-between">
          <div className=" relative w-[400px] h-[242px] rounded-lg">
            <Image src={dashBoard} alt="" fill />
          </div>
          <h3 className="font-semibold text-xl">Your Learning, Your Way</h3>
          <p className="text-[#6B7280]">
            Stay on track with a personalized dashboard that highlights your
            progress.
          </p>
        </div>
        <div className="flex flex-col w-[400px] h-[346px] justify-between">
          <div className=" relative w-[400px] h-[242px] rounded-lg">
            <Image src={certificates} alt="" fill />
          </div>
          <h3 className="font-semibold text-xl">
            Earn Recognized Certificates
          </h3>
          <p className="text-[#6B7280]">
            Receive accredited certificates that enhance your professional
            portfolio.
          </p>
        </div>
        <div className="flex flex-col w-[400px] h-[346px] justify-between">
          <div className=" relative w-[400px] h-[242px] rounded-lg">
            <Image src={support} alt="" fill />
          </div>
          <h3 className="font-semibold text-xl">Job Placement Support</h3>
          <p className="text-[#6B7280]">
            Access our job board and connect with potential employers in
            healthcare.
          </p>
        </div>
      </div>
      <Link href={"#"} className="flex items-center gap-2" >
        <p className="font-semibold text-[#0083AD]">Explore All Features</p>
        <div className="relative w-[24px] h-[28px]">
            <Image src={arrow} alt="" fill />
        </div>
      </Link>
    </section>
  );
}
