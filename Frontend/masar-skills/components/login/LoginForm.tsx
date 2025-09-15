
export default function LoginForm() {
  return (
    <form id="auth-form" className="flex flex-col gap-4" >
      
      {/* EMAIL ADDRESS */}
      <div className="flex flex-col">
        <label htmlFor="email" className="text-sm font-sans">
          Email address
        </label>
        <input className="w-[512px] h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6]" type="email" id="email" name="email" />
      </div>
      
      {/* PASSWORD */}
      <div className="flex flex-col ">
        <label htmlFor="password" className="text-sm font-sans">
          Password
        </label>
        <input className="w-[512px] h-[46px] bg-[#F0F9FF] rounded-lg border  border-[#D1E9F6]" type="password" id="password" name="password" />
      </div>
      
      
      
      <button
        className="w-full px-3 py-2.5 rounded-[8px] bg-[#0083AD] text-white flex justify-center items-center font-bold text-sm font-sans cursor-pointer hover:opacity-80"
        type="submit"
      >
        Sign In
      </button>
    </form>
  )
}
