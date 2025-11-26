import { verifyAuth } from "@/lib/auth";
import NavBarClient from "./NavBarClient";

export default async function NavBar() {
  const result = await verifyAuth();

  return <NavBarClient user={result.user} />;
}
