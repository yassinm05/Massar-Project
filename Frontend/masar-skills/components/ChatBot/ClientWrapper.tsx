

import { ChatbotProvider } from "@/context/ChatbotContext";
import Chatbot from "@/components/ChatBot/Chatbot";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatbotProvider>
      {children}
      <Chatbot />
    </ChatbotProvider>
  );
}