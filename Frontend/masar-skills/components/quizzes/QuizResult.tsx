import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import CertificateIcon from "@/public/assets/quizzes/Certificate.png";
import Link from "next/link";
import Eye from "@/public/assets/quizzes/eye.png";
import Arrow from "@/public/assets/quizzes/forwardArrow.png";

export default function QuizResult({examResult,openChatbot,sendMessage}) {
    const AnalyzeMyQuiz = async () => {
    openChatbot();
    await sendMessage("analyze my last quiz");
  };
  return (
    <div className="flex flex-col px-36 py-8 gap-8 bg-[#F9FAFB]">
      {/* QUIZ RESULT */}
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
              examResult.score > examResult.passingScore
                ? "bg-[#22C55E]"
                : "bg-[#DC2626]"
            }`}
            value={examResult.score}
          />
        </div>
      </div>
      {/* CERTIFICATE */}
      <div className="w-full rounded-xl p-8 flex flex-col items-center gap-6 bg-white">
        <p className="text-2xl font-bold">Your Digital Certificate Awaits!</p>
        <div className="relative w-24 h-24">
          <Image src={CertificateIcon} alt="" fill />
        </div>
        <p className="leading-6 text-[#4B5563] max-w-[47ch] text-center">
          Congratulations on completing the quiz! Click below to view and
          download your achievement.
        </p>
        <Link
          href={"#"}
          className="w-60 h-12 bg-[#16A34A] rounded-lg flex justify-center items-center gap-2"
        >
          <div className="relative w-6 h-4 ">
            <Image src={Eye} alt="" fill />
          </div>
          <p className="font-bold text-white">View Certificate</p>
        </Link>
      </div>
      <div className="w-full rounded-xl p-8 flex flex-col items-start gap-4 bg-white">
        <p className="font-semibold text-xl">What&apos;s Next?</p>
        <div className="flex flex-col gap-3 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-4 h-4 ">
              <Image src={Arrow} alt="" fill />
            </div>
            <p className="text-[#4B5563]">
              Review the topics where you scored lower to improve understanding.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-4 h-4 ">
              <Image src={Arrow} alt="" fill />
            </div>
            <p className="text-[#4B5563]">
              Practice with more advanced quizzes on specific patient care
              scenarios.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-4 h-4 ">
              <Image src={Arrow} alt="" fill />
            </div>
            <p className="text-[#4B5563]">
              Explore your nursing fundamentals textbook for in-depth learning.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-4 h-4 ">
              <Image src={Arrow} alt="" fill />
            </div>
            <p className="text-[#4B5563]">
              Challenge yourself with a timed quiz in a related subject area.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={AnalyzeMyQuiz}
            className="w-[161px] h-10 bg-[#16A34A] flex justify-center items-center font-semibold text-white rounded-lg cursor-pointer"
          >
            Analyze my Quiz
          </button>
          <Link
            href={"#"}
            className="w-[161px] h-10 bg-[#F3F4F6] flex justify-center items-center font-semibold text-[#1F2937] rounded-lg"
          >
            Analyze my Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
