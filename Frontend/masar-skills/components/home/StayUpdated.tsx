import Image from "next/image";
import typing from '@/public/assets/home/StayUpdated/Close-up of a person typing on a laptop.png';
import Link from "next/link";

export default function StayUpdated() {
  return (
    <section className="h-[406px] px-16 py-12 bg-[#F9FAFB] flex gap-12">
      <div className="w-1/2 flex flex-col gap-4 h-full justify-center">
        <h2 className="font-bold text-4xl">Stay Updated with Masar Skills</h2>
        <p className="text-lg leading-7 text-[#6B7280]">
          Subscribe to our newsletter for the latest courses, career insights,
          and industry updates.
        </p>
        <div className="flex gap-3">
            <input className="bg-[#FFFFFF] border border-[#D1D5DB] px-4 py-3.5 w-full h-12 rounded-lg" type="email" name="email"/>
            <Link className="w-[97px] h-[46px]  bg-[#0083AD] rounded-lg text-white flex justify-center items-center" href={"#"} >
                Sign Up
            </Link>
        </div>
        <p className="text-sm text-[#6B7280]">By signing up, you agree to our Terms and Conditions.</p>
      </div>
      <div className="relative w-1/2 rounded-xl overflow-hidden">
        <Image src={typing} alt="" fill/>
      </div>
    </section>
  );
}
