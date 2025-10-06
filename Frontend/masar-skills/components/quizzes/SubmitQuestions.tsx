import { submitAnswer } from "@/lib/quiz";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import timer from "@/public/assets/quizzes/timer.png";
import Image from "next/image";
import { Progress } from "../ui/progress";
import QuestionView from "./QuestionView";

interface Option {
  optionId: number;
  optionText: string;
}

interface Question {
  questionId: number;
  questionText: string;
  questionType: string;
  points: number;
  options: Option[];
}

interface Quiz {
  attemptId: number;
  quizId: number;
  quizTitle: string;
  quizDescription: string;
  timeLimitMinutes: number;
  attemptNumber: number;
  questions: Question[];
}



interface SelectedAnswers {
  [questionId: number]: {
    optionId: number;
    correctOptionId?: number;
  };
}

interface SubmitQuestionsProps {
  status: string;
  quiz: Quiz;
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  selectedAnswers: SelectedAnswers;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<SelectedAnswers>>;
  formatTime: (seconds: number) => string;
  timeRemaining: number;
  handleOptionSelect: (questionId: number, optionId: number) => void;
  selectedOption: number | undefined;
  handleFinishQuiz: () => Promise<void>;
  authToken: string; // Add this to pass the token from parent
}

export default function SubmitQuestions({
  status,
  quiz,
  currentQuestion,
  setCurrentQuestion,
  selectedAnswers,
  setError,
  setStatus,
  setSelectedAnswers,
  formatTime,
  timeRemaining,
  handleOptionSelect,
  selectedOption,
  handleFinishQuiz,
  authToken
}: SubmitQuestionsProps){
 const question: Question = quiz.questions[currentQuestion];
  const selectedOptionId: number | undefined =
    selectedAnswers[question.questionId]?.optionId;

     /**
   * Submits the current question's answer to the backend.
   * Moves to the next question, or finishes the quiz if it's the last one.
   */
  const handleSubmit = async (): Promise<void> => {
    if (status === "submitting" || !quiz) return;

    const currentQ = quiz.questions[currentQuestion];
    const selectedOption = selectedAnswers[currentQ.questionId];

    if (!selectedOption) {
      setError("Please select an answer before continuing.");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const cookieStore = await cookies(); // wait for it
  const tokenCookie = cookieStore.get("auth-token");
  if (!tokenCookie?.value) {
      return redirect("/");
    }
      const response = await submitAnswer(
        quiz.attemptId,
        currentQ.questionId,
        selectedOption.optionId,
        tokenCookie.value
      );

      if (!response) {
        throw new Error("Failed to submit answer");
      }

      // Update with the correct answer from backend
      setSelectedAnswers((prev: SelectedAnswers) => ({
        ...prev,
        [currentQ.questionId]: {
          optionId: selectedOption.optionId,
          correctOptionId: response.correctOptionId,
        },
      }));

      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev: number) => prev + 1);
        setStatus("submitted");
      } else {
        // Final question: finish quiz
        await handleFinishQuiz();
        setStatus("end of questions");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer. Please try again.");
      setStatus("still not");
    }
  };

  return (
    <div>
      <div className="flex flex-col px-4 py-8 gap-8 w-[740px]">
        <div className="flex justify-between p-4 rounded-2xl bg-[#F9FAFB]">
          <div className="font-medium text-[#374151]">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
          <div className="flex gap-2">
            <div className="relative w-5 h-5">
              <Image src={timer} alt="" fill />
            </div>
            <div className="text-medium text-[#374151]">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-[136px] h-2">
              <Progress value={(timeRemaining / (quiz.timeLimitMinutes * 60)) * 100} />
            </div>
          </div>
        </div>
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        <QuestionView
          currentQuestion={quiz.questions[currentQuestion]}
          handleOptionSelect={handleOptionSelect}
          handleSubmit={handleSubmit}
          selectedOption={selectedOptionId}
          submitState={status}
        />
      </div>
    </div>
  )
}
