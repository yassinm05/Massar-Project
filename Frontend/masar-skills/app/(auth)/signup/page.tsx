import Image from "next/image";
import nurse from "@/public/assets/signup/smilling nurse.png";
import SignupForm from "@/components/signup/SignupForm";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

import Link from "next/link";


export default async function page() {
  const result = await verifyAuth();
      if(result.user){
        return redirect('/');
      }
  return (
    <div className="w-full h-screen flex">
      <div className="py-12 px-28 flex flex-col gap-4 justify-center">
        <div className="flex flex-col ">
          <p className="font-bold text-4xl">Create your account</p>
          <p className="text-[16px] text-[#4C809A]">Join our community of learners and educators.</p>
        </div>
        {/* THE FORM */}
        <SignupForm/>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-0 border border-[#E5E7EB]"></div>
          <p className="text-sm text-[#6B7280]">Or sign up with</p>
          <div className="flex-1 h-0 border border-[#E5E7EB]"></div>
        </div>
        
        <div className="flex w-full justify-center items-center gap-1.5">
            <p className="text-sm text-[#6B7280]">Already have an account?</p>
            <Link href={"/login"} className="font-bold text-sm text-[#0083AD]">
              Sign in
            </Link>
          </div>
      </div>
      <div className="w-full relative">
        <Image src={nurse} alt="nurse" fill />
      </div>
    </div>
  );
}
