// app/components/NavBar.tsx (Server Component)
import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth"; // your auth function
import NavBarClient from "./NavBarClient";

export default async function NavBar() {
  const result = await verifyAuth();

  return <NavBarClient user={result.user} />;
}
