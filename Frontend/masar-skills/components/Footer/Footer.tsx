import Image from "next/image";
import Logo from "@/public/assets/footer/logo.png";
import Link from "next/link";
import Facebook from "@/public/assets/footer/facebook.png";
import Instagram from "@/public/assets/footer/instagram.png";
import Linkedin from "@/public/assets/footer/linkedin.png";
import Youtube from "@/public/assets/footer/youtube.png";
import X from "@/public/assets/footer/x.png";

export default function Footer() {
  return (
    <footer className="w-full px-16 py-20 bg-white flex flex-col gap-20 ">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16">
            <Image src={Logo} alt="logo" />
          </div>
          <p className="font-sans text-[51px] italic font-bold text-[#0083AD]">
            MasarSkills
          </p>
        </div>
        <ul className="flex gap-8">
          <li >
            <Link href={"#"}>Contact Us</Link>
          </li>
          <li >
            <Link href={"#"}>Help Center</Link>
          </li>
          <li >
            <Link href={"#"}>Careers Page</Link>
          </li>
          <li >
            <Link href={"#"}>Blog Updates</Link>
          </li>
          <li >
            <Link href={"#"}>FeedBack Form</Link>
          </li>
        </ul>
        <ul className="flex gap-4">
          <li className="flex justify-center items-center">
            <Link href={"#"}>
              <Image src={Facebook} alt="" />
            </Link>
          </li>
          <li className="flex justify-center items-center">
            <Link href={"#"}>
              <Image src={Instagram} alt="" />
            </Link>
          </li>
          <li className="flex justify-center items-center">
            <Link href={"#"}>
              <Image src={X} alt="" />
            </Link>
          </li>
          <li className="flex justify-center items-center">
            <Link href={"#"}>
              <Image src={Linkedin} alt="" />
            </Link>
          </li>
          <li className="flex justify-center items-center">
            <Link href={"#"}>
              <Image src={Youtube} alt="" />
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-8 ">
        <div className="w-full h-[0] border border-[#E5E7EB]"></div>
        <ul className="w-full flex gap-6 justify-center">
          <li className={`font-normal `}>
            @ 2025 Masar Skills. All rights reserved.
          </li>
          <li >
            <Link href={"#"}>Privacy Policy</Link>
          </li>
          <li className={`font-normal  `}>
            <Link href={"#"}>Terms of Use</Link>
          </li>
          <li className={`font-normal `}>
            <Link href={"#"}>Cookie Policy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
