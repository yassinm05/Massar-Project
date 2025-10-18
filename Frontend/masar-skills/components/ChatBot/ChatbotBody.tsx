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

interface ChatbotBodyProps {
  messages: Message[];
}

export default function ChatbotBody({ messages }: ChatbotBodyProps) {
  return (
    <div className="w-full px-7 py-5 flex flex-col gap-5 h-96 overflow-y-scroll">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`max-w-5/6 py-4 px-6 flex items-center ${
            message.source === "bot"
              ? "rounded-2xl rounded-bl-none bg-[#F3F4F6] text-[#565D6D] self-start"
              : "rounded-2xl rounded-br-none bg-[#0083AD] text-white self-end"
          }`}
        >
          <div className="w-fit break-words whitespace-pre-wrap leading-relaxed overflow-hidden">
            {message.typeOfMessage === "string" ? (
              message.body
            ) : (
              <audio controls src={message.body.audioUrl} className="w-full" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
