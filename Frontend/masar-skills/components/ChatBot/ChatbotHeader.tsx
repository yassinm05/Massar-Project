import Image from "next/image";
import Logo from "@/public/assets/chatbot/logo.png";
import newChat from "@/public/assets/chatbot/new chat.png";
import History from "@/public/assets/chatbot/history.png";
import Close from "@/public/assets/chatbot/close.png";

interface pageProps {
  setShow: (value: boolean) => void;
}
export default function ChatbotHeader({ setShow }: pageProps) {
  return (
    <>
      <div className="h-[70px] bg-[#0083AD] flex justify-between items-center px-7">
        <div className="flex gap-2 items-center">
          <div className="relative w-6 h-6">
            <Image src={Logo} alt="" fill />
          </div>
          <p className="font-medium text-xl text-white">Nursing Assistant</p>
        </div>
        <div className="flex gap-2 items-center">
          {/* new chat */}
          <div className="relative w-6 h-6">
            <Image src={newChat} alt="" fill />
          </div>
          {/* history */}
          <div className="relative w-6 h-6">
            <Image src={History} alt="" fill />
          </div>
          {/* close */}
          <button
            onClick={() => setShow(false)}
            className="relative w-6 h-6 cursor-pointer"
          >
            <Image src={Close} alt="" fill />
          </button>
        </div>
      </div>
    </>
  );
}
