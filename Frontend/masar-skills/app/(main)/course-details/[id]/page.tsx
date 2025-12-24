import { verifyAuth } from "@/lib/auth";
import { getCourseByID } from "@/lib/user";
import Image from "next/image";
import { redirect } from "next/navigation";
import User from "@/public/assets/course-details/user.png";
import Clock from "@/public/assets/course-details/clock.png";
import Download from "@/public/assets/course-details/download.png";
import Link from "next/link";
import CourseModule from "@/components/course-details/CourseModule";

// Type definitions
interface CourseModule {
  title: string;
  description: string;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructorName: string;
  durationHours: number;
  modules: CourseModule[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoursePage({ params }: PageProps) {
  // Verify authentication
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }

  // Await params (Next.js 15+ requirement)
  const { id } = await params;

  // Parse ID to number
  const courseId = parseInt(id, 10);

  // Validate ID
  if (isNaN(courseId)) {
    return redirect("/");
  }

  // Fetch course data
  const course: Course = await getCourseByID(courseId);

  // Calculate duration in weeks
  const durationInWeeks = (course.durationHours / 24 / 7).toFixed(2);

  return (
    <div className="flex flex-col px-12 py-10 gap-6 max-sm:px-4">
      {/* Course name and duration */}
      <div className="flex flex-col gap-3">
        <h1 className="font-bold text-4xl">{course.title}</h1>
        <p className="text-lg leading-7 text-[#565D6D]"></p>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center">
            <div className="relative w-4 h-4">
              <Image src={User} alt="Instructor icon" fill />
            </div>
            <div className="text-sm text-[#565D6D]">
              Instructor: Dr. {course.instructorName}
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <div className="relative w-4 h-4">
              <Image src={Clock} alt="Duration icon" fill />
            </div>
            <div className="text-sm text-[#565D6D]">
              Duration: {durationInWeeks} Weeks
            </div>
          </div>
        </div>
      </div>

      {/* About the course and video of the course */}
      <div className="flex gap-6 max-sm:flex-col">
        <div className="flex flex-col gap-5 p-5 rounded-xl border border-[#F3F4F6]">
          <p className="font-semibold text-2xl">Course Video</p>
          <div className="w-[720px] bg-amber-300 h-[405px] max-sm:w-full rounded-xl">
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
            <div className="bg-[#F3F4F6] rounded-xl py-2 px-3.5 flex justify-center items-center">
              <p className="font-semibold text-xs">patient core</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course modules and materials */}
      <div className="flex gap-6 max-sm:flex-col">
        <div className="w-1/2 flex flex-col p-5 gap-5 rounded-xl border border-[#F3F4F6] max-sm:w-full">
          <p className="font-semibold text-xl">Course Modules</p>
          {course.modules.map((module, index) => (
            <CourseModule
              key={`${module.order}-${index}`}
              moduleTitle={module.title}
              moduleDescription={module.description}
              moduleOrder={module.order}
            />
          ))}
        </div>
        <div className="w-1/2 gap-5 flex flex-col p-5 rounded-xl border border-[#F3F4F6] max-sm:w-full">
          <p className="font-semibold text-xl">Download Materials</p>
          <div className="flex flex-col gap-3">
            <Link href="#" className="flex gap-3 items-center">
              <div className="relative w-5 h-5">
                <Image src={Download} alt="Download icon" fill />
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
        <button
          type="button"
          className="w-96 h-11 rounded-lg bg-[#0083AD] text-white font-medium text-sm flex justify-center items-center cursor-pointer"
        >
          Access Final Exam
        </button>
      </div>
    </div>
  );
}