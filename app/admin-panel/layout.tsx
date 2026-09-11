import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/toast";

export const metadata: Metadata = {
  title: "Admin Panel - TV Channel",
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-950">
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
