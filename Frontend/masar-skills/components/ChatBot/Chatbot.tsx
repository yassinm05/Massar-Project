"use client";

import ChatbotBody from "./ChatbotBody";
import ChatbotHeader from "./ChatbotHeader";
import Image from "next/image";
import Mic from "@/public/assets/chatbot/Mic.png";
import Send from "@/public/assets/chatbot/send.png";
import chatbotIcon from "@/public/assets/chatbot/icon.png";
import AI from "@/public/assets/course-details/AI.png";
import { transcriptVoice } from "@/lib/chatbot";
import { useChatbot } from "@/context/ChatbotContext";
import { useEffect, useRef, useState } from "react";
import { verifyAuthAction } from "@/actions/auth-actions";
import { usePathname } from "next/navigation";

export default function Chatbot() {
  const {
    showChatbot,
    openChatbot,
    closeChatbot,
    messages,
    sendMessage,
    isLoading,
    studentId,
  } = useChatbot();
  const pathname = usePathname();
  const [inputText, setInputText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // ✅ Only render chatbot button or window if authenticated
  if (!isAuthenticated) return null;

  // 🎯 Handle text message send
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    await sendMessage(inputText);
    setInputText("");
  };

  // 🎙️ Send recorded audio to backend for transcription
  const sendAudioToAPI = async (audioBlob: Blob) => {
    try {
      if (!studentId) {
        alert("You must be logged in to send a message.");
        return;
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("studentId", studentId.toString());

      const response = await transcriptVoice(formData);
      if (response.response) {
        await sendMessage(response.response);
      }
    } catch (err) {
      alert(`Failed to process voice recording. Please try again. ${err}`);
    }
  };

  // 🎧 Start recording from microphone
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await sendAudioToAPI(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // 🛑 Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 🎙️ Handle mic button click
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 💬 Floating button (closed state)
  if (!showChatbot) {
    if (pathname.startsWith("/course-details")) {
      return (
        <div className="fixed right-20 bottom-20 bg-white z-20">
          <button className="w-40 h-12 cursor-pointer rounded-l-[30px] rounded-tr-[20px] border border-[#0083AD] flex items-center justify-center gap-2">
            <p className="font-semibold text-[#0083AD]">Study with AI</p>
            <div className="relative w-5 h-5">
              <Image src={AI} alt="" fill />
            </div>
          </button>
        </div>
      );
    } else {
      return (
        <div className="fixed right-6 bottom-6 z-20">
          <button
            onClick={openChatbot}
            className="w-32 h-32 rounded-full cursor-pointer relative"
          >
            <Image
              src={chatbotIcon}
              className="object-cover"
              alt="Chatbot"
              fill
            />
          </button>
        </div>
      );
    }
  }

  // 🪟 Open Chatbot window
  return (
    <div className="fixed z-20 w-[500px] top-5 right-5 border border-[#DEE1E6] rounded-3xl overflow-hidden bg-white">
      <ChatbotHeader setShow={closeChatbot} />
      <ChatbotBody messages={messages} />

      <div className="h-0 w-full border-b border-[#E5E7EB]"></div>

      {/* Input area */}
      <div className="flex items-center gap-4 py-3 px-7">
        <div className="w-full rounded-[20px] border border-[#DEE1E6]">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            type="text"
            disabled={isLoading}
            className="w-full placeholder:text-sm placeholder:text-[#565D6D] p-3 focus:outline-none disabled:opacity-50"
            placeholder="Ask about nursing topics or quizzes..."
          />
        </div>

        {/* Mic button */}
        <div
          onClick={handleMicClick}
          className={`w-10 h-10 rounded-full flex justify-center items-center shrink-0 cursor-pointer ${
            isRecording ? "bg-[#FCA5A5]" : "bg-[#F3F4F6]"
          }`}
        >
          <Image width={20} height={20} src={Mic} alt="Mic" />
        </div>

        {/* Send button */}
        <div
          onClick={handleSendMessage}
          className={`w-10 h-10 rounded-full bg-[#0083AD] flex justify-center items-center shrink-0 cursor-pointer ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Image width={20} height={20} src={Send} alt="Send" />
        </div>
      </div>

      {/* Footer info */}
      <div className="px-7 pb-5">
        <div className="p-4 rounded-2xl gap-2 bg-[#F3F4F6] font-medium leading-6 text-[#565D6D]">
          Assistant is powered by AI, so check for mistakes and don&apos;t share
          sensitive info. Your data will be used in accordance with Masara
          Skills&apos;s Privacy Notice.
        </div>
      </div>
    </div>
  );
}
