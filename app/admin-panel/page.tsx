import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";

export default async function AdminPanelIndex() {
  const session = await getServerSession();
  redirect(session ? "/admin-panel/dashboard" : "/admin-panel/login");
}
