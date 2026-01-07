import Image from "next/image";
import nurse from "@/public/assets/login/Nursing assistant students in a training session.png";
import Logo from "@/public/assets/navBar/logo.svg";
import LoginForm from "@/components/login/LoginForm";
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth";

export default async function page() {
  const result = await verifyAuth();
  if (result.user) {
    return redirect("/");
  }

  return (
    <div className="bg-white w-full h-screen max-sm:h-full flex justify-center items-center">
      <div className="w-[900px] h-[600px] max-sm:w-full max-sm:h-full shadow-2xl flex max-sm:flex-col  overflow-hidden rounded-2xl">
        {/* Left Side */}
        <div className="w-1/2 max-sm:w-full flex flex-col justify-center  px-10 py-8 bg-white max-sm:px-4">
          <div className="flex items-center h-[75px] overflow-hidden ">
            <div className="w-[140px] h-[150px] relative max-sm:w-[100px] max-sm:h-[100px]">
              <Image src={Logo} alt="logo" fill />
            </div>
            <p className="font-bold text-3xl text-[#0083AD] max-sm:text-2xl">
              Masar Skills
            </p>
          </div>

          <div className="flex flex-col gap-3 pb-8">
            <p className="font-bold text-3xl">Welcome Back!</p>
            <p className="text-[#4C809A] text-[15px]">
              Sign in to continue your journey with us.
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Right Side */}
        <div className="w-1/2 max-sm:w-full max-sm:h-[670px]   relative">
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
