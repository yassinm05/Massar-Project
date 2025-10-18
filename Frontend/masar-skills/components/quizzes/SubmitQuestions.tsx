"use client";

import Image from "next/image";
import timer from "@/public/assets/quizzes/timer.png";
import { Progress } from "../ui/progress";
import QuestionView from "./QuestionView";
import { submitAnswer } from "@/lib/quiz";

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
  error: string | null;
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  selectedAnswers: SelectedAnswers;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<SelectedAnswers>>;
  formatTime: (seconds: number) => string;
  timeRemaining: number;
  handleOptionSelect: (questionId: number, optionId: number) => void;
  selectedOption?: number;
  handleFinishQuiz: () => Promise<void>;
  authToken: string; // passed from parent
}

export default function SubmitQuestions({
  status,
  quiz,
  error,
  currentQuestion,
  setCurrentQuestion,
  selectedAnswers,
  setError,
  setStatus,
  setSelectedAnswers,
  formatTime,
  timeRemaining,
  handleOptionSelect,
  handleFinishQuiz,
  authToken,
}: SubmitQuestionsProps) {
  const question: Question = quiz.questions[currentQuestion];
  const selectedOptionId = selectedAnswers[question.questionId]?.optionId;

  /**
   * Submits the current question's answer to the backend.
   * Moves to the next question, or finishes the quiz if it's the last one.
   */
  const handleSubmit = async (): Promise<void> => {
    if (status === "submitting" || !quiz) return;

    const currentQ = quiz.questions[currentQuestion];
    const selected = selectedAnswers[currentQ.questionId];

    if (!selected) {
      setError("Please select an answer before continuing.");
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      // ✅ We already have authToken passed from parent
      const response = await submitAnswer(
        quiz.attemptId,
        currentQ.questionId,
        selected.optionId,
        authToken
      );

      if (!response) {
        throw new Error("Failed to submit answer");
      }

      // ✅ Update selected answers with correct option ID (if returned)
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQ.questionId]: {
          optionId: selected.optionId,
          correctOptionId: response.correctOptionId,
        },
      }));

      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setStatus("submitted");
      } else {
        await handleFinishQuiz();
        setStatus("completed");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div>
      <div className="flex flex-col px-4 py-8 gap-8 w-[740px]">
        {/* Header */}
        <div className="flex justify-between p-4 rounded-2xl bg-[#F9FAFB]">
          <div className="font-medium text-[#374151]">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>

          <div className="flex gap-2 items-center">
            <div className="relative w-5 h-5">
              <Image src={timer} alt="Timer icon" fill />
            </div>
            <div className="text-medium text-[#374151]">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-[136px] h-2">
              <Progress
                value={(timeRemaining / (quiz.timeLimitMinutes * 60)) * 100}
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Question View */}
        <QuestionView
          currentQuestion={quiz.questions[currentQuestion]}
          handleOptionSelect={handleOptionSelect}
          handleSubmit={handleSubmit}
          selectedOption={selectedOptionId}
          submitState={status}
        />
      </div>
    </div>
  );
}
