import Image from "next/image";
import Profile from "@/public/assets/navBar/profile.png";
import Link from "next/link";

interface Props{
    user :unknown,
    isPending:boolean,
    handleLogout:()=>void,
}

export default function Auth({user,handleLogout,isPending}:Props) {
  return (
    <div>
      {user ? (
          <div className="flex gap-4 items-center max-sm:flex-col">
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
          <div className="flex gap-4 max-sm:flex-col">
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
  )
}
