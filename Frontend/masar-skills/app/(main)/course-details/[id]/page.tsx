import { verifyAuth } from "@/lib/auth";
import { getCourseByID } from "@/lib/user";
import Image from "next/image";
import { redirect } from "next/navigation";
import User from "@/public/assets/course-details/user.png";
import Clock from "@/public/assets/course-details/clock.png";
import Download from "@/public/assets/course-details/download.png";
import Certificate from "@/public/assets/course-details/certificate.png";
import QR from "@/public/assets/course-details/qr.jpeg";
import Link from "next/link";

interface PageProps {
  params: {
    id: number;
  };
}
export default async function page({ params }: PageProps) {
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }
  const { id } = params;
  const course = await getCourseByID(id);
  return (
    <div className="flex flex-col px-12 py-10 gap-6 ">
      {/* course name and duration */}
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-4xl">{course.title}</h1>
        <p className="text-lg leading-7 text-[#565D6D]"></p>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center">
            <div className="relative w-4 h-4">
              <Image src={User} alt="" fill />
            </div>
            <div className="text-sm text-[#565D6D]">
              Instructor: Dr. {course.instructorName}
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <div className="relative w-4 h-4">
              <Image src={Clock} alt="" fill />
            </div>
            <div className="text-sm text-[#565D6D]">
              Duration: {(course.durationHours / 24 / 7).toFixed(2)} Weeks
            </div>
          </div>
        </div>
      </div>
      {/* about the course and video of the course */}
      <div className="flex gap-6 ">
        <div className=" flex flex-col gap-5 p-5 rounded-xl border border-[#F3F4F6]">
          <p className="font-semibold text-2xl">Course Video</p>
          <div className="w-[720px] bg-amber-300 h-[405px] rounded-xl  ">
            {/* <video width="720" height="405" controls preload="none">
              <source src="/path/to/video.mp4" type="video/mp4" />
            </video> */}
          </div>
        </div>
        <div className="w-full flex flex-col gap-5 p-5 rounded-xl border border-[#F3F4F6]">
          <p className="font-semibold text-xl">About This course</p>
          <p className="text-sm leading-5">{course.description}</p>
          {/* TAGS */}
          <div className="flex flex-wrap gap-2">
            <div className="bg-[#F3F4F6] rounded-xl py-2 px-3.5 flex justify-center items-center ">
              <p className="font-semibold text-xs">patient core</p>
            </div>
          </div>
        </div>
      </div>
      {/* course modules and materials */}
      <div className="flex gap-6">
        <div className="w-1/2 flex flex-col p-5 gap-5 rounded-xl border border-[#F3F4F6]">
          <p className="font-semibold text-xl">Course Modules</p>
        </div>
        <div className="w-1/2 gap-5 flex flex-col p-5 rounded-xl border border-[#F3F4F6]">
          <p className="font-semibold text-xl">Download Materials</p>
          <div className="flex flex-col gap-3">
            {/* TEST */}
            <Link href="#" className="flex gap-3 items-center">
              <div className="relative w-5 h-5">
                <Image src={Download} alt="" fill />
              </div>
              <p className="text-[#0083AD] leading-6">
                Patient Safety Checklist (PDF)
              </p>
            </Link>
          </div>
        </div>
      </div>
      {/* ACCESS FINAL EXAM BUTTON */}
      <div className="w-full flex justify-center">
        <button className="w-96 h-11 rounded-lg bg-[#0083AD] text-white font-medium text-sm flex justify-center items-center cursor-pointer">
        Access Final Exam
      </button>
      </div>
      {/* CERTIFICATE PREVIEW */}
      <div className="w-full flex flex-col items-center justify-center gap-5 p-5 rounded-xl border border-[#F3F4F6]">
        <p className="font-semibold text-xl">Certificate Preview</p>
        <div className="flex items-center justify-center gap-5">
          <div className="relative w-[600px] h-[400px] rounded-xl">
            <Image src={Certificate} alt="" fill />
          </div>
          <div className="w-[320px]  flex flex-col justify-center items-center gap-5 gap-3">
            <div className="relative w-[150] h-[150px] rounded-sm">
              <Image src={QR} alt="" fill />
            </div>
            <p className="text-center text-sm text-[#565D6D]">
              Scan this QR code to verify the authenticity and validity of your
              certificate.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
