'use client'
import { useChatbot } from "@/context/ChatbotContext";
import QuizResult from "./QuizResult";
export default function QuizResultClient({examResult}) {
    const { openChatbot, sendMessage } = useChatbot();
  return (
    <QuizResult examResult={examResult} openChatbot={openChatbot} sendMessage={sendMessage}/>
  )
}
