"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import timer from "@/public/assets/quizzes/timer.png";
import Close from "@/public/assets/quizzes/close.png";
import Check from "@/public/assets/quizzes/check.png";
import { Progress } from "../ui/progress";
import QuestionView from "./QuestionView";
import { handleFinishQuiz, submitAnswerAction } from "@/actions/quiz-actions";

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

interface QuizExamProps {
  quiz: Quiz;
  userId: number;
}

interface SelectedAnswers {
  [questionId: number]: {
    optionId: number;
    correctOptionId?: number;
  };
}

export default function QuizExam({ quiz }: QuizExamProps) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(
    quiz.timeLimitMinutes * 60
  );
  const [status, setStatus] = useState<string>("still not");
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles selecting an answer for a given question.
   */
  const handleOptionSelect = (questionId: number, optionId: number): void => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: {
        optionId,
        correctOptionId: prev[questionId]?.correctOptionId,
      },
    }));
    setError(null);
  };

  /**
   * Sends a request to the backend to finish the quiz attempt.
   */
  const finishQuiz = useCallback(async (): Promise<void> => {
    try {
      const base_url = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      console.log(base_url);
      const response = await handleFinishQuiz(quiz.attemptId);

      console.log("Quiz finished successfully:", response);
      setStatus("end of questions");
    } catch (err) {
      console.error("Error finishing quiz:", err);
      setStatus("end of questions");
    }
  }, [quiz.attemptId]);

  /**
   * Submits the current question's answer to the backend.
   */
  const handleSubmit = useCallback(async (): Promise<void> => {
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
      const response = await submitAnswerAction(
        quiz.attemptId,
        currentQ.questionId,
        selectedOption.optionId
      );

      if (!response) {
        throw new Error("Failed to submit answer");
      }

      // Update with the correct answer from backend
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQ.questionId]: {
          optionId: selectedOption.optionId,
          correctOptionId: response.correctOptionId,
        },
      }));

      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setStatus("submitted");
      } else {
        await finishQuiz();
        setStatus("end of questions");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer. Please try again.");
      setStatus("still not");
    }
  }, [status, quiz, currentQuestion, selectedAnswers, finishQuiz]);

  /**
   * Timer effect — decreases the time remaining each second.
   * If time runs out, automatically submits the quiz.
   */
  useEffect(() => {
    if (timeRemaining > 0) {
      const timerId = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeRemaining, handleSubmit]);

  /**
   * Converts remaining seconds into "MM:SS" format for display.
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const question = quiz.questions[currentQuestion];
  const selectedOptionId = selectedAnswers[question.questionId]?.optionId;

  // --- UI States ---

  // 🟡 Answering / Submitting
  if (status === "submitting" || status === "still not") {
    return (
      <div className="flex flex-col px-4 py-8 gap-8 w-[740px]">
        <div className="flex justify-between p-4 rounded-2xl bg-[#F9FAFB]">
          <div className="font-medium text-[#374151]">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-5 h-5">
              <Image src={timer} alt="" fill />
            </div>
            <div className="text-medium text-[#374151]">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-[136px] h-2">
              <Progress
                className="bg-[#E5E7EB]"
                className2={`${
                  timeRemaining < 120 ? "bg-[#DC2626]" : "bg-[#22C55E]"
                }`}
                value={(timeRemaining / (quiz.timeLimitMinutes * 60)) * 100}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <QuestionView
          currentQuestion={question}
          handleOptionSelect={handleOptionSelect}
          handleSubmit={handleSubmit}
          selectedOption={selectedOptionId}
          submitState={status}
        />

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
            className={`w-44 h-10 rounded-xl px-8 py-2 text-white font-semibold bg-[#16A34A] ${
              status === "submitting" ? "opacity-30" : ""
            }`}
          >
            {status === "submitting" ? "Submitting..." : "Submit Answer"}
          </button>
        </div>
      </div>
    );
  }

  // 🟢 Quiz Finished
  if (status === "end of questions") {
    return (
      <div className="flex flex-col px-4 py-8 gap-8 w-[740px]">
        <div className="flex justify-between p-4 rounded-2xl bg-[#F9FAFB]">
          <div className="font-medium text-[#374151]">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-5 h-5">
              <Image src={timer} alt="" fill />
            </div>
            <div className="text-medium text-[#374151]">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-[136px] h-2">
              <Progress
                className="bg-[#E5E7EB]"
                className2={`${
                  timeRemaining < 120 ? "bg-[#DC2626]" : "bg-[#22C55E]"
                }`}
                value={(timeRemaining / (quiz.timeLimitMinutes * 60)) * 100}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 p-8 rounded-xl bg-white">
          <p className="font-semibold text-2xl leading-8 text-[#1F2937]">
            {quiz.questions[currentQuestion].questionText}
          </p>
          <div className="flex flex-col gap-4">
            {quiz.questions[currentQuestion].options.map((option, index) => {
              const submittedQuestion = quiz.questions[currentQuestion - 1];
              const submittedSelectedOption =
                selectedAnswers[submittedQuestion?.questionId];
              const isSelected = selectedOptionId === option.optionId;
              const isCorrect =
                option.optionId === submittedSelectedOption?.correctOptionId;
              const isWrong = isSelected && !isCorrect;

              return (
                <div
                  key={index}
                  className={`flex justify-between rounded-lg border p-4 ${
                    isCorrect
                      ? "border-l-8 border-l-[#22C55E]"
                      : isWrong
                      ? "bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626]"
                      : "border-[#E5E7EB] text-[#4B5563]"
                  }`}
                >
                  <div className="flex gap-8">
                    <p className="font-bold text-[#4B5563]">
                      {String.fromCharCode(65 + index)}.
                    </p>
                    <p className="leading-6 text-[#374151]">
                      {option.optionText}
                    </p>
                  </div>
                  {isWrong && (
                    <div className="flex justify-center items-center overflow-hidden w-6 h-6 rounded-full bg-[#f9d3d3]">
                      <Image src={Close} className="w-3.5 h-3.5" alt="" />
                    </div>
                  )}
                  {isCorrect && (
                    <div className="flex justify-center items-center overflow-hidden w-6 h-6 rounded-full bg-[#dcf5e5]">
                      <Image src={Check} className="w-3.5 h-3.5" alt="" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <Link href={`/quizzes/result/${quiz.quizId}`}>
            <button className="w-[200px] h-10 rounded-xl bg-[#16A34A] px-8 py-2 font-semibold text-white">
              Review Summary
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // 🟢 Submitted (Show previous result)
  if (status === "submitted") {
    const submittedQuestion = quiz.questions[currentQuestion - 1];
    const submittedSelectedOption =
      selectedAnswers[submittedQuestion?.questionId];

    if (!submittedSelectedOption) {
      setStatus("still not");
      return null;
    }

    return (
      <div className="flex flex-col px-4 py-8 gap-8 w-[740px]">
        <div className="flex justify-between p-4 rounded-2xl bg-[#F9FAFB]">
          <div className="font-medium text-[#374151]">
            Question {currentQuestion} of {quiz.questions.length}
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative w-5 h-5">
              <Image src={timer} alt="" fill />
            </div>
            <div className="text-medium text-[#374151]">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-[136px] h-2">
              <Progress
                className="bg-[#E5E7EB]"
                className2={`${
                  timeRemaining < 120 ? "bg-[#DC2626]" : "bg-[#22C55E]"
                }`}
                value={(timeRemaining / (quiz.timeLimitMinutes * 60)) * 100}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 p-8 rounded-xl bg-white">
          <p className="font-semibold text-2xl leading-8 text-[#1F2937]">
            {submittedQuestion.questionText}
          </p>
          <div className="flex flex-col gap-4">
            {submittedQuestion.options.map((option, index) => {
              const isSelected =
                option.optionId === submittedSelectedOption.optionId;
              const isCorrect =
                option.optionId === submittedSelectedOption.correctOptionId;
              const isWrong = isSelected && !isCorrect;

              return (
                <div
                  key={index}
                  className={`flex justify-between rounded-lg border p-4 ${
                    isCorrect
                      ? "border-l-8 border-l-[#22C55E]"
                      : isWrong
                      ? "bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626]"
                      : "border-[#E5E7EB] text-[#4B5563]"
                  }`}
                >
                  <div className="flex gap-8">
                    <p className="font-bold">
                      {String.fromCharCode(65 + index)}.
                    </p>
                    <p className="leading-6">{option.optionText}</p>
                  </div>
                  {isWrong && (
                    <div className="flex justify-center items-center overflow-hidden w-6 h-6 rounded-full bg-[#f9d3d3]">
                      <Image src={Close} className="w-3.5 h-3.5" alt="" />
                    </div>
                  )}
                  {isCorrect && (
                    <div className="flex justify-center items-center overflow-hidden w-6 h-6 rounded-full bg-[#dcf5e5]">
                      <Image src={Check} className="w-3.5 h-3.5" alt="" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 1}
            className="rounded-xl border border-[#D1D5DB] px-8 py-2 font-semibold text-[#374151] disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => {
              const nextQuestion = quiz.questions[currentQuestion];
              const nextAnswer = selectedAnswers[nextQuestion.questionId];

              if (nextAnswer?.correctOptionId !== undefined) {
                setCurrentQuestion((prev) => prev + 1);
              } else {
                setStatus("still not");
              }
            }}
            className="rounded-xl bg-[#16A34A] px-8 py-2 font-semibold text-white"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return null;
}
