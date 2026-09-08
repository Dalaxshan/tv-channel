import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth/session";
import { DashboardShell } from "@/components/admin/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware already protects this route, but a
  // server-side check here guarantees no protected content is ever
  // rendered without a verified session, even if middleware config changes.
  const session = await getServerSession();
  if (!session) redirect("/admin-panel/login");

  return <DashboardShell adminName={session.name}>{children}</DashboardShell>;
}
