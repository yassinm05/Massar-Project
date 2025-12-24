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
  openChatbot: () => void; // ✅ Added
  closeChatbot: () => void; // ✅ Added
  toggleChatbot: () => void; // ✅ Added
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  studentId?: number;
  isAuthChecking: boolean; // ✅ Added for better UX
  submitAudioMessage: (message: string, response: string) => void;
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
  const [studentId, setStudentId] = useState<number | undefined>();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      setIsAuthChecking(true);
      const response = await verifyAuthAction();
      if (response.user) {
        setStudentId(response.studentId);
      }
      setIsAuthChecking(false);
    }
    checkAuth();
  }, []);

  // ✅ Chatbot control functions
  const openChatbot = () => {
    setShowChatbot(true);
  };

  const closeChatbot = () => {
    setShowChatbot(false);
  };

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };

  const sendMessage = async (text: string) => {
    const messageText = text.trim();
    if (!messageText || isLoading) return;

    // Wait for auth check to complete
    if (isAuthChecking) {
      setMessages((prev) => [
        ...prev,
        {
          source: "bot",
          body: "Please wait while I verify your credentials...",
          typeOfMessage: "string",
        },
      ]);
      return;
    }

    // Check if authenticated
    if (!studentId) {
      setMessages((prev) => [
        ...prev,
        {
          source: "bot",
          body: "You need to be logged in to use the chatbot. Please log in and try again.",
          typeOfMessage: "string",
        },
      ]);
      return;
    }

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
      const chatbotResponse = (await import("@/actions/chatbot-actions"))
        .default;
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

  const submitAudioMessage = async (message: string, response: string) => {
    const messageText = message.trim();
    const responseText = response.trim();
    if (!messageText || isLoading || !responseText) return;
    setMessages((prev) => [
      ...prev,
      {
        source: "user",
        body: messageText,
        typeOfMessage: "string",
      },
    ]);

    // Wait for auth check to complete
    if (isAuthChecking) {
      setMessages((prev) => [
        ...prev,
        {
          source: "bot",
          body: "Please wait while I verify your credentials...",
          typeOfMessage: "string",
        },
      ]);
      return;
    }

    // Check if authenticated
    if (!studentId) {
      setMessages((prev) => [
        ...prev,
        {
          source: "bot",
          body: "You need to be logged in to use the chatbot. Please log in and try again.",
          typeOfMessage: "string",
        },
      ]);
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        source: "bot",
        body: responseText,
        typeOfMessage: "string",
      },
    ]);
  };

  return (
    <ChatbotContext.Provider
      value={{
        showChatbot,
        openChatbot, // ✅ Provided
        closeChatbot, // ✅ Provided
        toggleChatbot, // ✅ Provided
        messages,
        sendMessage,
        isLoading,
        studentId,
        isAuthChecking, // ✅ Provided
        submitAudioMessage,
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