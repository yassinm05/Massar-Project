'use client'
import Image from "next/image";
import Logo from "@/public/assets/navBar/logo.png";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const pathName = usePathname();
  return (
    <header className="w-full  bg-white  ">
      <div className="flex items-center h-20 px-10 justify-between">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16">
          <Image src={Logo} alt="logo" />
        </div>
        <p className="font-sans text-[51px] italic font-bold text-[#0083AD]">
          MasarSkills
        </p>
      </div>
      <ul className="flex gap-8">
        <li className={` ${pathName === "/"?"text-[#0083AD]":"text-black"} `}>
          <Link href={"/"}>Home Page</Link>
        </li>
        <li className={`  `}>
          <Link href={"/course-catalog"}>Course Catalog</Link>
        </li>
        <li className={` `}>
          <Link href={"#"}>Job Board</Link>
        </li>
        <li className={``}>
          <Link href={"#"}>Exams & Feedback</Link>
        </li>
      </ul>
      <div className="flex gap-4">
        <button className=" rounded-lg border border-[#F3F4F6]  ">
            <Link className="block w-[97px] h-[44px] px-4 py-2" href={"/login"}>Login</Link>
        </button>
        <button className="rounded-lg  bg-[#0083AD] text-white text-md ">
            <Link className="block w-[97px] h-[44px] px-4 py-2" href={"/signup"}>sign Up</Link>
        </button>
      </div>
      </div>
      <div className="h-0 w-full border-b border-[#E5E7EB]"></div>
    </header>
  );
}
