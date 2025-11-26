"use client";

import Image from "next/image";
import Logo from "@/public/assets/navBar/logo.png";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "@/actions/auth-actions";
import Profile from '@/public/assets/navBar/profile.png';
import { useTransition } from "react";

export default function NavBarClient({ user }: { user: unknown }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout(pathname);

      if (pathname === "/") {
        router.refresh();
        window.location.reload();
      }
    });
  };

  return (
    <header className="w-full bg-white">
      <div className="flex items-center h-20 px-10 justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16">
            <Image src={Logo} alt="logo" />
          </div>
          <p className="font-sans text-[51px] italic font-bold text-[#0083AD]">
            MasarSkills
          </p>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-8">
          <li className={pathname === "/" ? "text-[#0083AD]" : "text-black"}>
            <Link href={"/"}>Home Page</Link>
          </li>
          <li
            className={
              pathname === "/course-catalog" ||
              pathname.startsWith("/course-details")
                ? "text-[#0083AD]"
                : "text-black"
            }
          >
            <Link href={"/course-catalog"}>Course Catalog</Link>
          </li>
          <li
            className={pathname === "/jobs" ? "text-[#0083AD]" : "text-black"}
          >
            <Link href={"/jobs"}>Job Board</Link>
          </li>
          <li
            className={
              pathname === "/quizzes" ? "text-[#0083AD]" : "text-black"
            }
          >
            <Link href={"/quizzes"}>Exams & Feedback</Link>
          </li>
          <li
            className={
              pathname === "/dashboard" ? "text-[#0083AD]" : "text-black"
            }
          >
            <Link href={"/dashboard"}>Dashboard</Link>
          </li>
        </ul>

        {/* Right Side (Auth) */}
        {user ? (
          <div className="flex gap-4 items-center">
            {/* Logout Button With Pending UI */}
            <form action={handleLogout}>
              <button
                disabled={isPending}
                className={`rounded-lg border border-[#F3F4F6] w-[97px] h-[44px] px-4 cursor-pointer flex items-center justify-center transition-all duration-200
                ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Logout"
                )}
              </button>
            </form>

            <div className="relative w-12 h-12 rounded-full border border-white">
              <Image
                src={Profile}
                alt="Profile"
                fill
                className="rounded-full"
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <button className="rounded-lg border border-[#F3F4F6]">
              <Link
                className="block w-[97px] h-[44px] px-4 py-2"
                href={"/login"}
              >
                Login
              </Link>
            </button>
            <button className="rounded-lg bg-[#0083AD] text-white text-md">
              <Link
                className="block w-[97px] h-[44px] px-4 py-2"
                href={"/signup"}
              >
                Sign Up
              </Link>
            </button>
          </div>
        )}
      </div>

      <div className="h-0 w-full border-b border-[#E5E7EB]"></div>
    </header>
  );
}
