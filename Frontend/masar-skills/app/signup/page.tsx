import Image from "next/image";
import nurse from "@/public/assets/signup/smilling nurse.png";
import Logo from "@/public/assets/signup/logo.png";
import SignupForm from "@/components/signup/SignupForm";

export default function page() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[736px] py-12 px-28 flex flex-col gap-8">
        <div className="flex ">
          <div className="w-12 h-12 relative">
            <Image src={Logo} alt="logo" fill />
          </div>
          <p className=" font-bold text-4xl">Masar Skills</p>
        </div>
        <div className="flex flex-col gap-5">
          <p className="font-bold text-4xl">Create your account</p>
          <p className="text-[16px] text-[#4C809A]">Join our community of learners and educators.</p>
        </div>
        {/* THE FORM */}
        <SignupForm/>
      </div>
      <div className="w-full relative">
        <Image src={nurse} alt="nurse" fill />
      </div>
    </div>
  );
}
