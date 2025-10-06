import { Progress } from "@/components/ui/progress";
import { verifyAuth } from "@/lib/auth";
import { getResult } from "@/lib/quiz";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

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
  const examResult = await getResult(id, tokenCookie.value);
  return (
    <div className="flex flex-col px-36 py-8 ">
      <div
        className={`flex flex-col  p-8 items-center gap-16 rounded-xl ${
          examResult.isPassed ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"
        }`}
      >
        <div className="flex flex-col gap-2 items-center">
          <p className="font-bold text-3xl text-[#1F2937]">Quiz Completed!</p>
          <p>
            You have {examResult.isPassed ? "successfully" : ""} completed the
            &apos;{examResult.quizTitle}&apos; quiz.
          </p>
          <p
            className={`font-bold text-7xl ${
              examResult.isPassed ? "text-[#16A34A]" : "text-[#DC2626]"
            }`}
          >
            {examResult.score}%
          </p>
          <p className="text-[#6B7280]">
            {examResult.isPassed ? "Correct" : "Needs Improvement"}
          </p>
          <p className="text-[#6B7280]">
            ({} out of {examResult.questions.length} questions)
          </p>
        </div>
        <div className="w-full">
          <Progress
            className="bg-[#E5E7EB]"
            className2={`${
              examResult.score > examResult.passingScore ? "bg-[#22C55E]" : "bg-[#DC2626]"
            }`}
            value={examResult.score}
          />
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
}
