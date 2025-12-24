import Welcome from "@/components/dashboard/Welcome";
import LearningJourney from "@/components/dashboard/LearningJourney";
import { verifyAuth } from "@/lib/auth";
import { getCourseEnrollment } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function page() {
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }
  const Enrollment = await getCourseEnrollment();
  console.log(Enrollment);
  //ROLE => User.role
  return (
    <div className="py-10 px-12 max-sm:px-0 flex flex-col gap-5">
      <Welcome firstName={result.user.firstName} />
      <LearningJourney enrollments={Enrollment} />
    </div>
  );
}
