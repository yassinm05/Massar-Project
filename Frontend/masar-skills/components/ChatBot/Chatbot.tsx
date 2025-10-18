"use client";
import ChatbotBody from "./ChatbotBody";
import ChatbotHeader from "./ChatbotHeader";
import { verifyAuthAction } from "@/actions/auth-actions";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Mic from "@/public/assets/chatbot/Mic.png";
import Send from "@/public/assets/chatbot/send.png";
import chatbotResponse from "@/actions/chatbot-actions";
import { transcriptVoice } from "@/lib/chatbot";

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

export default function Chatbot() {
  const [show, setShow] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      source: "bot",
      body: "Hi there! I'm your virtual study assistant. I can help you find quizzes, explain nursing concepts, and more. What would you like to do?",
      typeOfMessage: "string",
    },
    {
      source: "user",
      body: "Can you explain the concept of pharmacology?",
      typeOfMessage: "string",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [studentId, setStudentID] = useState<number>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Check if user is authenticated via API
    async function checkAuth() {
      const response = await verifyAuthAction();
      if (!response.user) {
        setIsAuthenticated(false);
        return;
      }
      setStudentID(response.user.id);
      setIsAuthenticated(true);
    }
    checkAuth();
  }, []);
  async function handleSendMessage(text?: string) {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    setMessages((prev) => [
      ...prev,
      {
        source: "user",
        body: messageText,
        typeOfMessage: "string",
      },
    ]);
    if (studentId === undefined) {
      console.error("Student ID is missing.");
      return;
    }
    const result = await chatbotResponse(messageText, studentId);
    setMessages((prev) => [
      ...prev,
      {
        source: "bot",
        body: result.response,
        typeOfMessage: "string",
      },
    ]);
    setInputText("");
  }
  const sendAudioToAPI = async (audioBlob: Blob) => {
    try {
      if (!studentId) {
        alert("You must be logged in to send a message.");
        return;
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("studentId", studentId.toString()); // ✅ fixed

      const response = await transcriptVoice(formData);
      if (response.response) {
        setMessages((prev) => [
          ...prev,
          {
            source: "bot",
            body: response.response,
            typeOfMessage: "string",
          },
        ]);
      }
    } catch (err) {
      alert(`Failed to process voice recording. Please try again. ${err}`);
    }
  };

  // Start recording
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

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  // Handle mic button click
  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
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
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            type="text"
            className="w-full placeholder:text-sm placeholder:text-[#565D6D] p-3 focus:outline-none "
            placeholder="Ask about nursing topics or quizzes..."
          />
        </div>
        {/* VOICE RECORDING */}
        <div
          onClick={handleMicClick}
          className=" w-10 h-10  rounded-full bg-[#F3F4F6] flex justify-center items-center shrink-0 cursor-pointer"
        >
          <Image width={20} height={20} src={Mic} alt="" />
        </div>
        <div
          onClick={() => handleSendMessage()}
          className=" w-10 h-10 rounded-full bg-[#0083AD] flex justify-center items-center shrink-0 cursor-pointer"
        >
          <Image width={20} height={20} src={Send} alt="" />
        </div>
      </div>
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
