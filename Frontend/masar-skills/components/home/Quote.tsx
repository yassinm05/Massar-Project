import Image from "next/image";
import Sarah from "@/public/assets/home/Quote/Sarah Johnson.png";
import { MotionDiv } from "../framer-motion/motion";

export default function Quote() {
  return (
    <section className="h-[430px] bg-[#F9FAFB] flex flex-col justify-center items-center gap-5">
      <MotionDiv
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.6, ease: "backInOut" }}
        className="relative rounded-full border border-[#0083AD] w-20 h-20"
      >
        <Image src={Sarah} alt="" fill />
      </MotionDiv>
      <MotionDiv
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.3, ease: "backInOut" }}
        className="leading-[32px] text-lg w-[768px] text-center text-[#374151] "
      >
        &quot;Masar Skills transformed my learning experience. The interactive
        content and instant feedback kept me engaged and motivated throughout my
        courses.&quot;
      </MotionDiv>
      <MotionDiv
        initial={{ opacity: 0, y: -100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: "backInOut" }}
      >
        <p className="font-semibold text-center text-[#0083AD]">
          Sarah Johnson
        </p>
        <p className="text-[15px] leading-6 text-center text-[#6B7280]">
          Nursing Student
        </p>
      </MotionDiv>
    </section>
  );
}
