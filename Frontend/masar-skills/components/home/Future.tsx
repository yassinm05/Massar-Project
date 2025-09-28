import Link from "next/link";
import Image from "next/image";
import group from '@/public/assets/home/Future/Diverse group of students smiling and looking at the camera.png';

export default function Future() {
  return (
    <section className="h-[561px] flex px-16 py-28 items-center">
      <div className="w-1/2 flex flex-col pr-3 gap-7">
        <p className="font-bold text-5xl max-w-[20ch] leading-12">
          Your Learning Journey Starts Here.
        </p>
        <p className="text-lg leading-7 text-[#6B7280]">
          Whether you&apos;re a student aspiring to join the healthcare industry
          or a professional, we&apos;ve got you on the path to success.
        </p>
        <div className="flex gap-4">
          <Link
            className="flex justify-center items-center w-32 h-12 px-4 py-2  rounded-lg  bg-[#0083AD] text-white"
            href={"/signup"}
          >
            Get Started
          </Link>

          <Link
            className="w-32 h-12 px-4 py-2 flex justify-center items-center rounded-lg border border-[#F3F4F6]  "
            href={"#"}
          >
            Learn More
          </Link>
        </div>
      </div>
      <div className="relative w-1/2 rounded-xl h-[337px] overflow-hidden">
        <Image src={group} alt="" fill />
      </div>
    </section>
  );
}
