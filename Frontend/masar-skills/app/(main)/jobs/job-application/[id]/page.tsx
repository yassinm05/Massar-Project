import { verifyAuthAction } from "@/actions/auth-actions";
import { redirect } from "next/navigation";
import JobsApplication from "@/components/jobs/jobApplication/JobsApplication";
interface PageProps {
  params: {
    id: number;
  };
}

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const result = await verifyAuthAction();
  if (!result.user) {
    return redirect("/");
  }
  return <JobsApplication id={id} />;
}
