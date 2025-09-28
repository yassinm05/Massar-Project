import Image from "next/image";
import Sarah from "@/public/assets/home/Quote/Sarah Johnson.png";

export default function Quote() {
  return (
    <section className="h-[430px] bg-[#F9FAFB] flex flex-col justify-center items-center gap-5">
      <div className="relative rounded-full border border-[#0083AD] w-20 h-20">
        <Image src={Sarah} alt="" fill />
      </div>
      <p className="leading-[32px] text-lg w-[768px] text-center text-[#374151] ">
        &quot;Masar Skills transformed my learning experience. The interactive
        content and instant feedback kept me engaged and motivated throughout my
        courses.&quot;
      </p>
      <div>
        <p className="font-semibold text-center text-[#0083AD]">Sarah Johnson</p>
        <p className="text-[15px] leading-6 text-center text-[#6B7280]">Nursing Student</p>
      </div>
    </section>
  );
}
