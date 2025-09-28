import { Progress } from "@/components/ui/progress";
import Link from "next/link";

interface Enrollment {
  id: string | number;
  courseTitle: string;
  progressPercentage: number;
  courseId: string | number;
}

interface Props {
  enrollments: Enrollment[];
}

export default function LearningJourney({ enrollments }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <p className="font-semibold text-3xl">My Learning Progress</p>
      <div className="w-full flex flex-wrap justify-center gap-10">
        {enrollments.map((Enrollment , index) => (
          <div
            className="flex flex-col w-[363px] h-[216px] p-5 gap-5 rounded-xl border border-[#F3F4F6]"
            key={index}
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-md">
                {/* <Image src={} alt=""/> */}
              </div>
              <div className="font-semibold text-lg leading-7">
                {Enrollment.courseTitle}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="text-sm text-[#565D6D]">Progress</p>
                <div className="font-medium text-sm text-[#0083AD]">
                  {Enrollment.progressPercentage}%
                </div>
              </div>
              <Progress value={Enrollment.progressPercentage} />
            </div>
            <Link
              className="font-medium text-sm text-[#0083AD] text-center"
              href={
                `/course-details/${Enrollment.courseId}`
                
              }
            >
              Continue Learning
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
