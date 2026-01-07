"use client";

import Image from "next/image";
import { FaBars } from "react-icons/fa6";
import Logo from "@/public/assets/navBar/logo.svg";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { logout } from "@/actions/auth-actions";
import { useState, useTransition } from "react";
import Auth from "./Auth";
import Close from "@/public/assets/navBar/close.png";
import { MotionDiv } from "../framer-motion/motion";
import { AnimatePresence } from "framer-motion";

export default function NavBarClient({ user }: { user: unknown }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      await logout(pathname);

      if (pathname === "/") {
        router.refresh();
        window.location.reload();
      }
    });
  };

  const closeMenu = () => {
    setShow(false);
  };

  return (
    <header className="bg-white relative ">
      <div className=" w-full relative  flex items-center h-20 px-10 max-sm:px-4 justify-between overflow-hidden">
        <div className="flex items-center gap-0 max-sm:gap-0">
          <div className="relative w-[100px] h-[82px] max-sm:w-[70px] ">
            <Image src={Logo} alt="logo" fill />
          </div>
          <p className="font-sans text-[51px] max-sm:text-2xl italic font-bold text-[#0083AD]">
            MasarSkills
          </p>
        </div>

        {/* Navigation Links */}
        <ul className="flex gap-8 max-sm:hidden">
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
        <div className="max-sm:hidden">
          <Auth user={user} isPending={isPending} handleLogout={handleLogout} />
        </div>
        <div className="sm:hidden">
          {show ? (
            <button
              onClick={() => setShow(!show)}
              className="sm:hidden cursor-pointer"
            >
              <div className="relative w-6 h-6">
                <Image src={Close} alt="" fill />
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShow(!show)}
              className="sm:hidden cursor-pointer"
            >
              <FaBars className="w-6 h-6 text-[#0082AD]" />
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {show && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white absolute z-30 left-0 right-0 top-20  py-10 text-lg flex flex-col items-center gap-6 sm:hidden overflow-y-auto overflow-x-hidden"
          >
            <ul className="flex flex-col gap-8 w-full items-center">
              <li
                className={pathname === "/" ? "text-[#0083AD]" : "text-black"}
                onClick={closeMenu}
              >
                <Link href={"/"}>Home Page</Link>
              </li>
              <li
                className={
                  pathname === "/course-catalog" ||
                  pathname.startsWith("/course-details")
                    ? "text-[#0083AD]"
                    : "text-black"
                }
                onClick={closeMenu}
              >
                <Link href={"/course-catalog"}>Course Catalog</Link>
              </li>
              <li
                className={
                  pathname === "/jobs" ? "text-[#0083AD]" : "text-black"
                }
                onClick={closeMenu}
              >
                <Link href={"/jobs"}>Job Board</Link>
              </li>
              <li
                className={
                  pathname === "/quizzes" ? "text-[#0083AD]" : "text-black"
                }
                onClick={closeMenu}
              >
                <Link href={"/quizzes"}>Exams & Feedback</Link>
              </li>
              <li
                className={
                  pathname === "/dashboard" ? "text-[#0083AD]" : "text-black"
                }
                onClick={closeMenu}
              >
                <Link href={"/dashboard"}>Dashboard</Link>
              </li>
            </ul>
            <Auth
              user={user}
              isPending={isPending}
              handleLogout={handleLogout}
            />
          </MotionDiv>
        )}
      </AnimatePresence>
      <div className="h-0 w-full border-b border-[#E5E7EB]"></div>
    </header>
  );
}
