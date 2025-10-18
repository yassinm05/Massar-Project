"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Clock } from "lucide-react";

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
  initialQuiz: Quiz;
  userId: number;
}

interface SelectedAnswers {
  [key: number]: number;
}

export default function QuizExam({ initialQuiz, userId }: QuizExamProps) {
  const [quiz] = useState<Quiz>(initialQuiz);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(
    initialQuiz.timeLimitMinutes * 60
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sends a request to the backend to finish the quiz attempt.
   * Displays the results screen afterwards.
   */
  const handleFinishQuiz = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/api/Quiz/finish/${quiz.attemptId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setShowResults(true);
      } else {
        throw new Error("Failed to finish quiz");
      }
    } catch (err) {
      console.error("Error finishing quiz:", err);
      setShowResults(true); // fallback
    }
  }, [quiz.attemptId]);

  /**
   * Submits the current question's answer to the backend.
   * Moves to the next question, or finishes the quiz if it's the last one.
   */
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (isSubmitting || !quiz) return;

    const currentQ = quiz.questions[currentQuestion];
    const selectedOption = selectedAnswers[currentQ.questionId];

    if (!selectedOption) {
      setError("Please select an answer before continuing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/Quiz/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: quiz.attemptId,
          questionId: currentQ.questionId,
          selectedOptionId: selectedOption,
          userId, // optional: include userId if needed
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        await handleFinishQuiz();
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    quiz,
    currentQuestion,
    selectedAnswers,
    userId,
    handleFinishQuiz,
  ]);

  /**
   * Timer effect — decreases time each second, auto-submits when time runs out.
   */
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, showResults, handleSubmit]);

  /** Select answer */
  const handleOptionSelect = (questionId: number, optionId: number): void => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  /** Format seconds into MM:SS */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /** Progress percentage */
  const calculateProgress = (): number => {
    if (!quiz) return 0;
    return ((currentQuestion + 1) / quiz.questions.length) * 100;
  };

  // --- Results Screen ---
  if (showResults) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 mb-6">
            Your answers have been submitted successfully.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const selectedOptionId = selectedAnswers[question.questionId];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{quiz.quizTitle}</h1>
          <p className="text-gray-600 mt-1">{quiz.quizDescription}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <div className="flex items-center space-x-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-semibold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Question */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {question.questionText}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOptionId === option.optionId;
              return (
                <button
                  key={option.optionId}
                  onClick={() =>
                    handleOptionSelect(question.questionId, option.optionId)
                  }
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-700">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-800">{option.optionText}</span>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedOptionId || isSubmitting}
              className="px-8 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting
                ? "Submitting..."
                : currentQuestion === quiz.questions.length - 1
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          Powered by Masar Skills
        </div>
      </main>
    </div>
  );
}
