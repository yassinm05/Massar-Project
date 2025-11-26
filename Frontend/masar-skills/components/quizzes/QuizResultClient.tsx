'use client'
import { useChatbot } from "@/context/ChatbotContext";
import QuizResult from "./QuizResult";
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
interface QuizResultProps {
  examResult: {
    isPassed: boolean;
    quizTitle: string;
    score: number;
    passingScore: number;
    questions: Question[];
  };
}
export default function QuizResultClient({ examResult }: QuizResultProps) {
  const { openChatbot, sendMessage } = useChatbot();
  return (
    <QuizResult
      examResult={examResult}
      openChatbot={openChatbot}
      sendMessage={sendMessage}
    />
  );
}
