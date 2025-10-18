import CourseCatalogLogic from "@/components/course-catalog/CourseCatalogLogic";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCourses } from "@/lib/courses";

export default async function page() {
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }

  const courses = await getCourses();
  return <CourseCatalogLogic courses={courses} />;
}
