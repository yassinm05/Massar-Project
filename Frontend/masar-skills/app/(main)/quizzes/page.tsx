import { verifyAuth } from "@/lib/auth";
import { getAvailableQuizzes } from "@/lib/quiz";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

// Define the Quiz type if not imported from elsewhere
type Quiz = {
  quizId: string;
  quizTitle: string;
  courseName: string;
};
export default async function page() {
  
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }
  const cookieStore = await cookies(); // wait for it
  const tokenCookie = cookieStore.get("auth-token");
  if (!tokenCookie?.value) {
    return redirect("/");
  }

  const quizzes = await getAvailableQuizzes(tokenCookie?.value);
  return (
    <div className="flex flex-col p-8 gap-8">
      <h1 className="font-bold text-3xl">Available Quizzes</h1>
      <div className=" flex flex-wrap gap-4 justify-center">
        {quizzes.map((quiz: Quiz, index: number) => (
          <div
            className="w-[280] h-[364] rounded-xl p-6 flex flex-col justify-between shadow-xl"
            key={index}
          >
            {/* Render quiz details here */}
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-300 rounded-lg">
                  {/* <Image src={} alt="" fill/> */}
                </div>
                <p className="font-semibold text-lg leading-7">
                  {quiz.quizTitle}
                </p>
              </div>
              <p className="text-sm leading-5">{quiz.courseName}</p>
            </div>
            <Link
              href={`/quizzes/${quiz.quizId}`}
              className="bg-[#0083AD] w-[232px] h-[40px] rounded-xl text-white flex justify-center items-center cursor-pointer"
            >
              Start Quiz
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
