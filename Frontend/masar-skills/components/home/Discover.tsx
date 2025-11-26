import Image from "next/image";
import Link from "next/link";
import Icon1 from "@/public/assets/home/Discover/icon1.png";
import Icon2 from "@/public/assets/home/Discover/Icon2.png";
import Icon3 from "@/public/assets/home/Discover/Icon3.png";
import Arrow from "@/public/assets/home/Discover/arrow.png";
import {
  MotionDiv,
  MotionH3,
  MotionH5,
  MotionP,
} from "../framer-motion/motion";

export default function Discover() {
  return (
    <section className="px-20 py-28 flex flex-col gap-20">
      <div className="flex gap-20 items-center justify-between">
        <MotionH3
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 10,
            bounce: 0.5,
          }}
          className="w-1/2 font-bold text-[45px] leading-[1.2]"
        >
          Discover Our Comprehensive Services for Students and Instructors
        </MotionH3>
        <MotionP
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 10,
            bounce: 0.5,
          }}
          className="w-1/2 text-lg text-[#4B5563] leading-[1.5] max-w-[52ch]"
        >
          At Masar Skills, we prioritize your educational journey. Our platform
          offers seamless student registration, easy course enrollment, and
          personalized career advisory services. Experience a user-friendly
          interface designed to support your learning and professional growth.
        </MotionP>
      </div>
      <div className="flex justify-between gap-12">
        <div className="flex flex-col gap-8">
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: "backInOut" }}
          >
            <Image src={Icon1} alt="" />
          </MotionDiv>
          <MotionH5
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "backInOut" }}
            className="font-bold text-2xl"
          >
            Streamlined Student Dashboard
          </MotionH5>
          <MotionP
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: "backInOut" }}
            className="text-[#4B5563]"
          >
            Access our platform with a simple and intuitive student dashboard
            for effortless learning.
          </MotionP>
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, ease: "backInOut" }}
          >
            <Link href={"/signup"} className="flex gap-2 items-center">
              <p className="text-lg">Sign Up</p>
              <div>
                <Image src={Arrow} alt="" />
              </div>
            </Link>
          </MotionDiv>
        </div>
        <div className="flex flex-col gap-8">
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: "backInOut" }}
          >
            <Image src={Icon2} alt="" />
          </MotionDiv>
          <MotionH5
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, ease: "backInOut" }}
            className="font-bold text-2xl"
          >
            Courses Tailored to Your Career
          </MotionH5>
          <MotionP
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: "backInOut" }}
            className="text-[#4B5563]"
          >
            Browse our extensive catalog to find the perfect course for your
            professional path.
          </MotionP>
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, ease: "backInOut" }}
          >
            <Link href={"#"} className="flex gap-2 items-center">
              <p className="text-lg">Learn More</p>
              <div>
                <Image src={Arrow} alt="" />
              </div>
            </Link>
          </MotionDiv>
        </div>
        <div className="flex flex-col gap-8">
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: "backInOut" }}
          >
            <Image src={Icon3} alt="" />
          </MotionDiv>
          <MotionH5
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, ease: "backInOut" }}
            className="font-bold text-2xl"
          >
            AI Career Advisor
          </MotionH5>
          <MotionP
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.4, ease: "backInOut" }}
            className="text-[#4B5563]"
          >
            Get expert career advice anytime with our AI-powered chatbot for
            personalized guidance.
          </MotionP>
          <MotionDiv
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, ease: "backInOut" }}
          >
            <Link href={"#"} className="flex gap-2 items-center">
              <p className="text-lg">Chat Now</p>
              <div>
                <Image src={Arrow} alt="" />
              </div>
            </Link>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
