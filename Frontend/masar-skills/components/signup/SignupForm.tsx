// signupForm.tsx
"use client";
import { useFormState } from "react-dom";
import { signup } from "@/actions/auth-actions";

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
  const [formState, formAction] = useFormState(signup, initialState);

  return (
    <form id="auth-form" className="flex flex-col gap-4" action={formAction}>
      {/* first and last name */}
      <div className="flex gap-7 justify-between">
        <div className="flex flex-col ">
          <label htmlFor="firstName" className="text-sm font-sans">
            First Name
          </label>
          <input className="w-[229px] h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6] " type="text" id="firstName" name="firstName" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="lastName" className="text-sm font-sans">
            Last Name
          </label>
          <input className="bg-[#F0F9FF] w-[229px] h-[46px] rounded-lg border  border-[#D1E9F6]" type="text" id="lastName" name="lastName" />
        </div>
      </div>
      {/* EMAIL ADDRESS */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-sans">
          Email address
        </label>
        <input className="w-[512px] h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6]" type="email" id="email" name="email" />
      </div>
      {/* PHONE NUMBER */}
      <div className="flex flex-col">
        <label htmlFor="phoneNumber" className="text-sm font-sans">
          Phone Number
        </label>
        <input className="w-[512px] h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6]" type="tel" id="phoneNumber" name="phoneNumber" />
      </div>
      {/* ROLE */}
      <div className="flex flex-col">
        <label htmlFor="role" className="text-sm font-sans">
          Role
        </label>
        <select className="w-[512px] h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6]" name="role">
          <option value="" disabled>Select Your role</option>
          <option value="student">student</option>
          <option value="instructor">instructor</option>
          <option value="administrator">administrator</option>
        </select>
      </div>
      {/* PASSWORD */}
      <div className="flex flex-col ">
        <label htmlFor="password" className="text-sm font-sans">
          Password
        </label>
        <input className="w-[512px] h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6]" type="password" id="password" name="password" />
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

      <button
        className="w-full px-3 py-2.5 rounded-[8px] bg-[#0083AD] text-white flex justify-center items-center font-bold text-sm font-sans cursor-pointer hover:opacity-80"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}
