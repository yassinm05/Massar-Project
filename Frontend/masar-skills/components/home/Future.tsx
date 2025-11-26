import Link from "next/link";
import Image from "next/image";
import group from '@/public/assets/home/Future/Diverse group of students smiling and looking at the camera.png';
import { MotionDiv, MotionP } from "../framer-motion/motion";

export default function Future() {
  return (
    <section className="h-[561px] flex px-16 py-28 items-center">
      <div className="w-1/2 flex flex-col pr-3 gap-7">
        <MotionP
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "backInOut" }}
          className="font-bold text-5xl max-w-[20ch] leading-12"
        >
          Your Learning Journey Starts Here.
        </MotionP>
        <MotionP
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.3, ease: "backInOut" }}
          className="text-lg leading-7 text-[#6B7280]"
        >
          Whether you&apos;re a student aspiring to join the healthcare industry
          or a professional, we&apos;ve got you on the path to success.
        </MotionP>
        <div className="flex gap-4">
          <MotionDiv
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: "backInOut" }}
          >
            <Link
              className="flex justify-center items-center w-32 h-12 px-4 py-2  rounded-lg  bg-[#0083AD] text-white"
              href={"/signup"}
            >
              Get Started
            </Link>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.6, ease: "backInOut" }}
          >
            <Link
              className="w-32 h-12 px-4 py-2 flex justify-center items-center rounded-lg border border-[#F3F4F6]  "
              href={"#"}
            >
              Learn More
            </Link>
          </MotionDiv>
        </div>
      </div>
      <MotionDiv
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.6, ease: "backInOut" }}
        className="relative w-1/2 rounded-xl h-[337px] overflow-hidden"
      >
        <Image src={group} alt="" fill />
      </MotionDiv>
    </section>
  );
}
