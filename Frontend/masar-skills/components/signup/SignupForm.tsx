"use client";
import { useActionState } from "react";
import { signup } from "@/actions/auth-actions";
import { signIn } from "next-auth/react";
import Facebook from '@/public/assets/signup/facebook.png'
import Google from '@/public/assets/signup/google.png'
import Image from "next/image";
import { Spinner } from "../ui/spinner";

interface FormState {
  errors: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    password?: string;
    phoneNumber?: string;
  };
}

export default function SignupForm() {
  const initialState: FormState = { errors: {} };
  const [formState, formAction, isPending] = useActionState(
    signup,
    initialState
  );

  return (
    <form
      id="auth-form"
      className="flex flex-col gap-4 w-full"
      action={formAction}
    >
      {/* first and last name */}
      <div className="flex gap-8 justify-between w-full max-sm:flex-col max-sm:gap-4">
        <div className="flex flex-col gap-2 max-sm:w-full">
          <label htmlFor="firstName" className="text-sm font-sans ">
            First Name
          </label>
          <input
            className="w-[229px] h-[46px] max-sm:w-full bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6] px-3 focus:outline-none focus:border-[#0083AD]"
            type="text"
            id="firstName"
            name="firstName"
          />
        </div>
        <div className="flex flex-col gap-2 max-sm:w-full">
          <label htmlFor="lastName" className="text-sm font-sans">
            Last Name
          </label>
          <input
            className="bg-[#F0F9FF] w-[229px] h-[46px] max-sm:w-full rounded-lg border  border-[#D1E9F6] px-3 focus:outline-none focus:border-[#0083AD]"
            type="text"
            id="lastName"
            name="lastName"
          />
        </div>
      </div>
      {/* EMAIL ADDRESS */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-sans">
          Email address
        </label>
        <input
          className="w-[512px] h-[46px] max-sm:w-full bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6] px-3 focus:outline-none focus:border-[#0083AD]"
          type="email"
          id="email"
          name="email"
        />
      </div>
      {/* PHONE NUMBER */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phoneNumber" className="text-sm font-sans">
          Phone Number
        </label>
        <input
          className="w-[512px] h-[46px] max-sm:w-full bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6] px-3 focus:outline-none focus:border-[#0083AD]"
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
        />
      </div>
      {/* ROLE */}
      <div className="flex flex-col gap-2">
        <label htmlFor="role" className="text-sm font-sans">
          Role
        </label>
        <select
          className="w-[512px] h-[46px] max-sm:w-full bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6] focus:outline-none focus:border-[#0083AD] px-3"
          name="role"
          id="role"
        >
          <option value="" disabled>
            Select Your role
          </option>
          <option value="Student">student</option>
          <option value="Instructor">instructor</option>
          <option value="Admin">administrator</option>
        </select>
      </div>
      {/* PASSWORD */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-sans">
          Password
        </label>
        <input
          className="w-[512px] h-[46px] max-sm:w-full bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6] px-3 focus:outline-none focus:border-[#0083AD]"
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
          Sign Up
        </button>
      )}
      <div className="flex gap-8">
        <div
          onClick={() => signIn("facebook")}
          className="flex-1 flex justify-center items-center rounded-xl gap-3 border border-[#F3F4F6] py-2 cursor-pointer"
        >
          <div className="relative w-5 h-5">
            <Image src={Facebook} alt="" fill />
          </div>
          <p className="font-bold text-sm text-[#6B7280]">Facebook</p>
        </div>
        <div
          onClick={() => signIn("google")}
          className="flex-1 flex justify-center items-center rounded-xl gap-3 border border-[#F3F4F6] py-2 cursor-pointer"
        >
          <div className="relative w-5 h-5">
            <Image src={Google} alt="" fill />
          </div>
          <p className="font-bold text-sm text-[#6B7280]">Google</p>
        </div>
      </div>
    </form>
  );
}
