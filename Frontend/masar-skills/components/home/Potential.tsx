import Image from "next/image";
import Link from "next/link";
import dashBoard from "@/public/assets/home/Potential/Personalized student dashboard.png";
import certificates from "@/public/assets/home/Potential/Student receiving a certificate.png";
import support from "@/public/assets/home/Potential/Healthcare professionals in a meeting.png";
import arrow from "@/public/assets/home/Potential/arrow.png";
import { MotionDiv, MotionH1, MotionP } from "../framer-motion/motion";

export default function Potential() {
  return (
    <section className="h-[804px] pt-28 px-16 flex flex-col gap-16 items-center justify-center">
      <div className="flex flex-col gap-4">
        <MotionH1
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 10,
            bounce: 0.5,
          }}
          className="font-bold text-4xl leading-10 text-center"
        >
          Unlock Your Potential with Masar Skills
        </MotionH1>
        <MotionP
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 10,
            bounce: 0.5,
          }}
          className="w-[716px] text-lg leading-7 text-[#6B7280] text-center"
        >
          Experience a transformative learning journey with our extensive
          catalog of accredited courses, providing the skills and certifications
          needed for success.
        </MotionP>
      </div>
      <div className="flex gap-8 justify-between w-full">
        <MotionDiv
          initial={{ opacity: 0, x: 150 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            bounce: 0.5,
          }}
          className="flex flex-col w-[400px] h-[346px] justify-between"
        >
          <div className=" relative w-[400px] h-[242px] rounded-lg">
            <Image src={dashBoard} alt="" fill />
          </div>
          <h3 className="font-semibold text-xl">Your Learning, Your Way</h3>
          <p className="text-[#6B7280]">
            Stay on track with a personalized dashboard that highlights your
            progress.
          </p>
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, x: 120 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 10,
            bounce: 0.5,
          }}
          className="flex flex-col w-[400px] h-[346px] justify-between"
        >
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
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 10,
            bounce: 0.5,
          }}
          className="flex flex-col w-[400px] h-[346px] justify-between"
        >
          <div className=" relative w-[400px] h-[242px] rounded-lg">
            <Image src={support} alt="" fill />
          </div>
          <h3 className="font-semibold text-xl">Job Placement Support</h3>
          <p className="text-[#6B7280]">
            Access our job board and connect with potential employers in
            healthcare.
          </p>
        </MotionDiv>
      </div>
      <MotionDiv
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 10,
          bounce: 0.5,
        }}
      >
        <Link href={"#"} className="flex items-center gap-2">
          <p className="font-semibold text-[#0083AD]">Explore All Features</p>
          <div className="relative w-[24px] h-[28px]">
            <Image src={arrow} alt="" fill />
          </div>
        </Link>
      </MotionDiv>
    </section>
  );
}
