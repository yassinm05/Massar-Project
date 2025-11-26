import Image from "next/image";
import HealthCare from "@/public/assets/home/LearningJourney/Healthcare professionals collaborating.png";
import Link from "next/link";
import { MotionDiv, MotionP } from "../framer-motion/motion";

export default function LearningJourney() {
  return (
    <section className="h-[561px] flex px-16 py-28 items-center">
      <div className="w-1/2 flex flex-col pr-3 gap-7">
        <MotionP
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 10,
            bounce: 0.5,
          }}
          className="font-bold text-5xl max-w-[20ch] leading-12"
        >
          Your Learning Journey Starts Here.
        </MotionP>
        <MotionP
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 10,
            bounce: 0.5,
          }}
          className="text-lg leading-7 text-[#6B7280]"
        >
          Whether you&apos;re a student aspiring to join the healthcare industry
          or a professional, we&apos;ve got you on the path to success.
        </MotionP>
        <MotionDiv
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 30,
            damping: 10,
            bounce: 0.5,
          }}
          className="flex gap-4"
        >
          <Link
            className="flex justify-center items-center w-32 h-12 px-4 py-2  rounded-lg  bg-[#0083AD] text-white"
            href={"#"}
          >
            Get Started
          </Link>

          <Link
            className="w-32 h-12 px-4 py-2 flex justify-center items-center rounded-lg border border-[#F3F4F6]  "
            href={"#"}
          >
            Learn More
          </Link>
        </MotionDiv>
      </div>
      <MotionDiv
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          bounce: 0.5,
        }}
        viewport={{ once: true, amount: 0.4 }}
        className="relative w-1/2 rounded-xl h-[337px] overflow-hidden"
      >
        <Image src={HealthCare} alt="" fill />
      </MotionDiv>
    </section>
  );
}
