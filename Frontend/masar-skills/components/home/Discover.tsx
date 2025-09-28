import Image from "next/image";
import Link from "next/link";
import Icon1 from "@/public/assets/home/Discover/icon1.png";
import Icon2 from "@/public/assets/home/Discover/Icon2.png";
import Icon3 from "@/public/assets/home/Discover/Icon3.png";
import Arrow from "@/public/assets/home/Discover/arrow.png";

export default function Discover() {
  return (
    <section className="px-20 py-28 flex flex-col gap-20">
      <div className="flex gap-20 items-center justify-between">
        <h3 className="w-1/2 font-bold text-[40px] leading-[1.2]">
          Discover Our Comprehensive Services for Students and Instructors
        </h3>
        <p className="w-1/2 text-lg text-[#4B5563] leading-[1.5] max-w-[52ch]">
          At Masar Skills, we prioritize your educational journey. Our platform
          offers seamless student registration, easy course enrollment, and
          personalized career advisory services. Experience a user-friendly
          interface designed to support your learning and professional growth.
        </p>
      </div>
      <div className="flex justify-between gap-12">
        <div className="flex flex-col gap-8">
          <div>
            <Image src={Icon1} alt="" />
          </div>
          <h5 className="font-bold text-2xl">Streamlined Student Dashboard</h5>
          <p className="text-[#4B5563]">
            Access our platform with a simple and intuitive student dashboard
            for effortless learning.
          </p>
          <Link href={"/signup"} className="flex gap-2 items-center">
            <p className="text-lg">Sign Up</p>
            <div>
              <Image src={Arrow} alt="" />
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <Image src={Icon2} alt="" />
          </div>
          <h5 className="font-bold text-2xl">
            Courses Tailored to Your Career
          </h5>
          <p className="text-[#4B5563]">
            Browse our extensive catalog to find the perfect course for your
            professional path.
          </p>
          <Link href={"#"} className="flex gap-2 items-center">
            <p className="text-lg">Learn More</p>
            <div>
              <Image src={Arrow} alt="" />
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <Image src={Icon3} alt="" />
          </div>
          <h5 className="font-bold text-2xl">AI Career Advisor</h5>
          <p className="text-[#4B5563]">
            Get expert career advice anytime with our AI-powered chatbot for
            personalized guidance.
          </p>
          <Link href={"#"} className="flex gap-2 items-center">
            <p className="text-lg">Chat Now</p>
            <div>
              <Image src={Arrow} alt="" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
