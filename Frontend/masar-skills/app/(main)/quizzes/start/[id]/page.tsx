import QuizExam from "@/components/quizzes/QuizExam";
import { verifyAuth } from "@/lib/auth";
import { getQuizByID } from "@/lib/quiz";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page({ params }: { params: { id: number } }) {
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("auth-token");
  if (!tokenCookie?.value) {
    return redirect("/");
  }
  const { id } = params;
  const quiz = await getQuizByID(id, tokenCookie.value);
  return (
    <div className="w-full bg-[#F8FAFC] flex justify-center ">
      {quiz ? (
        <QuizExam quiz={quiz} userId={result.user.id} />
      ) : (
        <div>no questions found in this exam</div>
      )}
    </div>
  );
}
