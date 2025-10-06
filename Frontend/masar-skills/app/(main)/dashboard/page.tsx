import Welcome from "@/components/dashboard/Welcome";
import LearningJourney from "@/components/dashboard/LearningJourney";
import { verifyAuth } from "@/lib/auth";
import { getCourseEnrollment, getUserById } from "@/lib/user";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function page() {
  const result = await verifyAuth();
  if(!result.user){
    return redirect('/');
  }
 
  const User = await getUserById(result.user.id);
  const Enrollment = await getCourseEnrollment();
  console.log(Enrollment)
  //ROLE => User.role
  return <div className="py-10 px-12 flex flex-col gap-5">
    <Welcome firstName={User.firstName} />
    <LearningJourney enrollments={Enrollment}/>
  </div>;
}
