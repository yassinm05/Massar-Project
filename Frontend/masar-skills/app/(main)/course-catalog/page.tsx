import CourseCatalogFilter from "@/components/course-catalog/CourseCatalogFilter";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }
  return (
    <div className="px-16">
      <h1 className="font-bold text-3xl">Course Catalog</h1>
      <div>
        <CourseCatalogFilter />
      </div>
    </div>
  );
}
