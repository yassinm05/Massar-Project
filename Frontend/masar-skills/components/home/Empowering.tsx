import Image from "next/image";
import MedicalStudent from "@/public/assets/home/Empowering/Medical student in a classroom.png";
import ChatBot from "@/public/assets/home/Empowering/chatbot.png";
import Tick from "@/public/assets/home/Empowering/tick.png";
import { MotionDiv, MotionH1, MotionP } from "../framer-motion/motion";

export default function Empowering() {
  return (
    <section className=" h-[527px] bg-[#F9FAFB] flex items-center py-[96px] px-16 gap-16">
      <MotionDiv
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 10,
          bounce: 0.5,
        }}
        className="relative w-1/2 h-[333px] rounded-xl overflow-hidden"
      >
        <Image src={MedicalStudent} alt="" fill />
      </MotionDiv>
      <div className="w-1/2 h-[336px] flex flex-col justify-between gap-6">
        <MotionH1
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 10,
            bounce: 0.5,
          }}
          className="font-bold text-4xl leading-12 max-w-[25ch]"
        >
          Empowering Your Healthcare Career.
        </MotionH1>
        <MotionP
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 10,
            bounce: 0.5,
          }}
          className="text-lg leading-7 text-[#6B7280] max-w-[50ch]"
        >
          At Masar Skills, we are dedicated to transforming healthcare
          education. Our platform provides students and professionals with tools
          for skill enhancement.
        </MotionP>
        <div className="flex gap-4">
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 10,
              bounce: 0.5,
            }}
            className="flex w-1/2 gap-4"
          >
            <div>
              <Image src={ChatBot} alt="" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-lg">AI Chatbot</p>
              <p className=" text-md leading-6 text-[#6B7280] max-w-[25ch]">
                Get instant answers and guidance with our AI Career Advisor.
              </p>
            </div>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              type: "spring",
              stiffness: 30,
              damping: 10,
              bounce: 0.5,
            }}
            className="flex w-1/2  gap-4"
          >
            <div>
              <Image src={Tick} alt="" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-lg">Verified Certificates</p>
              <p className=" text-md leading-6 text-[#6B7280] max-w-[25ch]">
                Showcase your accomplishments with secure digital certificates.
              </p>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
