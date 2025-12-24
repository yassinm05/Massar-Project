import { verifyAuth } from "@/lib/auth";
import { getQuizByID } from "@/lib/quiz";
import Image from "next/image";
import { redirect } from "next/navigation";
import questionMark from "@/public/assets/quizzes/question mark.png";
import clock from "@/public/assets/quizzes/clock.png";
import tick from "@/public/assets/quizzes/tick.png";
import instruction from "@/public/assets/quizzes/instruction.png";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function page({ params }: { params: { id: number } }) {
  const result = await verifyAuth();
  if (!result.user) {
    return redirect("/");
  }
  const cookieStore = await cookies(); // wait for it
    const tokenCookie = cookieStore.get("auth-token");
    if (!tokenCookie?.value) {
        return redirect("/");
      }
  const { id } = params;
  const quiz = await getQuizByID(id,tokenCookie.value);
  return (
    <div className="bg-[#F9FAFB] w-full py-20 flex justify-center max-sm:px-4">
      <div className="w-fit bg-white shadow-sm p-[41px] max-sm:px-4 flex flex-col gap-8 justify-center items-center rounded-xl max-sm:w-full">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-xl text-center">{quiz.quizTitle}</h1>
          <p className="leading-6 text-center text-sm">
            Test your knowledge on the essential principles and practices of
            nursing.
          </p>
        </div>
        <div className="flex gap-8 max-sm:flex-col max-sm:items-center">
          <div className="flex gap-2">
            <div className="relative w-6 h-6 ">
              <Image src={questionMark} alt="" fill />
            </div>
            <p className="text-[#4B5563]">{quiz.questions.length} Questions</p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-6 h-6 ">
              <Image src={clock} alt="" fill />
            </div>
            <p className="text-[#4B5563]">{quiz.timeLimitMinutes} Minutes</p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-6 h-6 ">
              <Image src={tick} alt="" fill />
            </div>
            {/* passing score */}
            <p className="text-[#4B5563]">{quiz.passingScore}% Passing Score</p>
          </div>
        </div>
        <div className="rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] p-6 flex flex-col gap-3 items-center">
          <p className="font-semibold text-center text-lg">Instructions</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <div className="relative w-5 h-5">
                <Image src={instruction} alt="" fill />
              </div>
              <p className="text-[#4B5563]">
                Read each question carefully before answering.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative w-5 h-5">
                <Image src={instruction} alt="" fill />
              </div>
              <p className="text-[#4B5563]">
                You will have 10 minutes to complete the quiz.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative w-5 h-5">
                <Image src={instruction} alt="" fill />
              </div>
              <p className="text-[#4B5563]">
                Your score will be displayed upon completion.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative w-5 h-5">
                <Image src={instruction} alt="" fill />
              </div>
              <p className="text-[#4B5563]">
                Ensure you have a stable internet connection.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative w-5 h-5">
                <Image src={instruction} alt="" fill />
              </div>
              <p className="text-[#4B5563]">Good luck and do your best!</p>
            </div>
          </div>
        </div>
        <Link
          className="rounded-xl px-12 py-3 bg-[#16A34A] flex justify-center items-center text-white font-semibold text-lg"
          href={`/quizzes/start/${id}`}
        >
          Start Quiz
        </Link>
        <Link className=" text-[#4B5563] font-semibold " href={"/quizzes"}>
          Back to Quizzes
        </Link>
      </div>
    </div>
  );
}
