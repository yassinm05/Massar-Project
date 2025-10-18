import Image from "next/image";
import nurse from "@/public/assets/login/Nursing assistant students in a training session.png";
import Logo from "@/public/assets/login/logo.png";
import LoginForm from "@/components/login/LoginForm";
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth";

export default async function page() {
  const result = await verifyAuth();
    if(result.user){
      return redirect('/');
    }
  
  return (
    <div className="bg-white w-full h-screen flex justify-center items-center">
  <div className="w-[900px] h-[600px] shadow-2xl flex overflow-hidden rounded-2xl">
    {/* Left Side */}
    <div className="w-1/2 flex flex-col justify-center gap-8 px-10 py-8 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 relative">
          <Image src={Logo} alt="logo" fill />
        </div>
        <p className="font-bold text-3xl">Masar Skills</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-bold text-3xl">Create your account</p>
        <p className="text-[#4C809A] text-[15px]">
          Join our community of learners and educators.
        </p>
      </div>

      <LoginForm />
    </div>

    {/* Right Side */}
    <div className="w-1/2 relative">
      <Image
        src={nurse}
        alt="nurse"
        fill
        className="object-cover object-center"
      />
    </div>
  </div>
</div>

  );
}
