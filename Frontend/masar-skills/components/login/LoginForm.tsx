"use client";
import { login } from "@/actions/auth-actions";
import { useActionState } from "react";
import Image from "next/image";
import Facebook from "@/public/assets/signup/facebook.png";
import Google from "@/public/assets/signup/google.png";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

interface FormState {
  errors: {
    email?: string;
    password?: string;
  };
}
export default function LoginForm() {
  const initialState: FormState = { errors: {} };
  const [formState, formAction, isPending] = useActionState(
    login,
    initialState
  );
  return (
    <form id="auth-form" className="flex flex-col gap-4" action={formAction}>
      {/* EMAIL ADDRESS */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-sans">
          Email address
        </label>
        <input
          className="w-full h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6]"
          type="email"
          id="email"
          name="email"
        />
      </div>

      {/* PASSWORD */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-sans">
          Password
        </label>
        <input
          className="w-full h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6]"
          type="password"
          id="password"
          name="password"
        />
      </div>

      {/* ERRORS */}
      {formState.errors && Object.keys(formState.errors).length > 0 && (
        <ul>
          {Object.keys(formState.errors).map((key) => (
            <li key={key} className="text-red-500 text-sm">
              {formState.errors[key as keyof typeof formState.errors]}
            </li>
          ))}
        </ul>
      )}

      {isPending ? (
        <button
          className="w-full opacity-60 px-3 py-2.5 rounded-[8px] bg-[#0083AD] text-white flex justify-center items-center font-bold text-sm font-sans cursor-pointer hover:opacity-80"
          type="submit"
        >
          <Spinner />
        </button>
      ) : (
        <button
          className="w-full px-3 py-2.5 rounded-[8px] bg-[#0083AD] text-white flex justify-center items-center font-bold text-sm font-sans cursor-pointer hover:opacity-80"
          type="submit"
        >
          Sign In
        </button>
      )}
      <div className="flex gap-8">
        <div className="flex-1 px-3 py-2.5 flex justify-center items-center rounded-xl gap-3 border border-[#D1D5DB]  cursor-pointer">
          <div className="relative w-5 h-5">
            <Image src={Facebook} alt="" fill />
          </div>
        </div>
        <div className="flex-1 px-3 py-2.5 flex justify-center items-center rounded-xl gap-3 border border-[#D1D5DB]  cursor-pointer">
          <div className="relative w-5 h-5">
            <Image src={Google} alt="" fill />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center items-center gap-1.5">
        <p className="text-sm text-[#6B7280]">Don&apos;t have an account?</p>
        <Link href={"/signup"} className="font-bold text-sm text-[#0083AD]">
          Sign up
        </Link>
      </div>
    </form>
  );
}
