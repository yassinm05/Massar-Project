"use client";
import { redirect } from "next/navigation";
import ChatbotBody from "./ChatbotBody";
import ChatbotHeader from "./ChatbotHeader";
import { verifyAuthAction } from "@/actions/auth-actions";
import { useEffect, useState } from "react";
import Image from "next/image";
import Mic from '@/public/assets/chatbot/Mic.png';
import Send from '@/public/assets/chatbot/send.png';
import chatbotResponse from "@/lib/chatbot";

interface VoiceData {
  audioUrl: string;
  duration?: number;
  transcription?: string;
  mimeType?: string;
}

type Message = 
  | {
      source: string;
      body: string;
      typeOfMessage: "string";
    }
  | {
      source: string;
      body: VoiceData;
      typeOfMessage: "voice";
    };

export default function Chatbot() {
  const [show, setShow] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      source: "bot",
      body:
        "Hi there! I'm your virtual study assistant. I can help you find quizzes, explain nursing concepts, and more. What would you like to do?",
      typeOfMessage:"string",
    },
    {
      source: "question",
      body:"Can you explain the concept of pharmacology?",
      typeOfMessage:"string",
   },
  ]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    // Check if user is authenticated via API
    async function checkAuth() {
      const response = await verifyAuthAction();
      if (!response.user) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
    }
    checkAuth();
  }, []);
   async function handleSendMessage (text: string)  {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    setMessages(prev => [...prev, {
      source: "question",
      body: messageText,
      typeOfMessage: "string"
    }]);
    const response = await chatbotResponse(messageText);
    
    setInputText("");

  };

  // Don't render anything if not authenticated
  if (!isAuthenticated) return null;
  if (!show) {
    return (
      <div className="fixed right-6 bottom-6 ">
        <button
          onClick={() => setShow(true)}
          className="w-12 h-12 rounded-full bg-black cursor-pointer"
        ></button>
      </div>
    );
  }

  return (
    <div className="fixed z-20 w-[500px] top-0 left-0 border border-[#DEE1E6] rounded-3xl overflow-hidden bg-white ">
      <ChatbotHeader setShow={setShow} />
      <ChatbotBody messages={messages} />
      <div className="h-0 w-full border-b border-[#E5E7EB]"></div>
      <div className="flex items-center gap-4 py-3 px-7">
        <div className="w-full rounded-[20px] border border-[#DEE1E6]">
          <input type="text" className="w-full placeholder:text-sm placeholder:text-[#565D6D] p-3 focus:outline-none " placeholder="Ask about nursing topics or quizzes..."/>
        </div>
        {/* VOICE RECORDING */}
        <div className=" w-10 h-10  rounded-full bg-[#F3F4F6] flex justify-center items-center shrink-0 cursor-pointer">
          <Image width={20} height={20} src={Mic} alt="" />
        </div>
        <div className=" w-10 h-10 rounded-full bg-[#0083AD] flex justify-center items-center shrink-0 cursor-pointer">
          <Image width={20} height={20} src={Send}  alt="" />
        </div>
      </div>
      <div className="px-7 pb-5">
        <div className="p-4 rounded-2xl gap-2 bg-[#F3F4F6] font-medium leading-6 text-[#565D6D]">
          Assistant is powered by AI, so check for mistakes and don&apos;t share sensitive info. Your data will be used in accordance with Masara Skills&apos;s Privacy Notice.
      </div>
      </div>
    </div>
  );
}
