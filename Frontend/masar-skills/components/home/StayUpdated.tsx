import Image from "next/image";
import typing from '@/public/assets/home/StayUpdated/Close-up of a person typing on a laptop.png';
import Link from "next/link";
import { MotionDiv, MotionP } from "../framer-motion/motion";

export default function StayUpdated() {
  return (
    <section className="h-[406px] px-16 py-12 bg-[#F9FAFB] flex gap-12">
      <div className="w-1/2 flex flex-col gap-4 h-full justify-center">
        <MotionDiv
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: "backInOut" }}
          className="font-bold text-4xl"
        >
          Stay Updated with Masar Skills
        </MotionDiv>
        <MotionP
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "backInOut" }}
          className="text-lg leading-7 text-[#6B7280]"
        >
          Subscribe to our newsletter for the latest courses, career insights,
          and industry updates.
        </MotionP>
        <MotionDiv
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: "backInOut" }}
          className="flex gap-3"
        >
          <input
            className="bg-[#FFFFFF] border border-[#D1D5DB] px-4 py-3.5 w-full h-12 rounded-lg"
            type="email"
            name="email"
          />
          <Link
            className="w-[97px] h-[46px]  bg-[#0083AD] rounded-lg text-white flex justify-center items-center"
            href={"#"}
          >
            Sign Up
          </Link>
        </MotionDiv>
        <MotionP
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, ease: "backInOut" }}
          className="text-sm text-[#6B7280]"
        >
          By signing up, you agree to our Terms and Conditions.
        </MotionP>
      </div>
      <MotionDiv
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease: "backInOut" }}
        className="relative w-1/2 rounded-xl overflow-hidden"
      >
        <Image src={typing} alt="" fill />
      </MotionDiv>
    </section>
  );
}
