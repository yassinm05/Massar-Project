"use client";
import { verifyAuthAction } from "@/actions/auth-actions";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface VoiceData {
  audioUrl: string;
  duration?: number;
  transcription?: string;
  mimeType?: string;
}

type Message =
  | {
      source: "bot" | "user";
      body: string;
      typeOfMessage: "string";
    }
  | {
      source: "bot" | "user";
      body: VoiceData;
      typeOfMessage: "voice";
    };

type ChatbotContextType = {
  showChatbot: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
  toggleChatbot: () => void;
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  studentId?: number;
};

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: ReactNode }) {
  
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      source: "bot",
      body: "Hi there! I'm your virtual study assistant. I can help you find quizzes, explain nursing concepts, and more. What would you like to do?",
      typeOfMessage: "string",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ Auth states

  const [studentId, setStudentId] = useState<number | undefined>();
 useEffect(() => {
    // Check if user is authenticated via API
    async function checkAuth() {
      const response = await verifyAuthAction();
      if (!response.user) {
        return;
      }
      setStudentId(response.user.id);
    }
    checkAuth();
  }, []);




  const openChatbot = () => {

      setShowChatbot(true);

  };
  
  const closeChatbot = () => setShowChatbot(false);
  const toggleChatbot = () => {

      setShowChatbot((prev) => !prev);

  };

  const sendMessage = async (text: string) => {
    const messageText = text.trim();
    if (!messageText || isLoading ) return;

    setMessages((prev) => [
      ...prev,
      {
        source: "user",
        body: messageText,
        typeOfMessage: "string",
      },
    ]);

    setIsLoading(true);

    try {
      if (!studentId) {
        throw new Error("Student ID not found");
      }

      const chatbotResponse = (await import("@/actions/chatbot-actions")).default;
      const result = await chatbotResponse(messageText, studentId);

      setMessages((prev) => [
        ...prev,
        {
          source: "bot",
          body: result.response,
          typeOfMessage: "string",
        },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          source: "bot",
          body: "Sorry, I encountered an error. Please try again.",
          typeOfMessage: "string",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        showChatbot,
        openChatbot,
        closeChatbot,
        toggleChatbot,
        messages,
        sendMessage,
        isLoading,
        studentId,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within ChatbotProvider");
  }
  return context;
}