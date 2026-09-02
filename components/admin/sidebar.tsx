"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Image as ImageIcon, ListVideo, CalendarClock, LogOut, Tv, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useToast } from "@/components/admin/toast";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin-panel/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin-panel/dashboard/hero", label: "Hero Management", icon: ImageIcon },
  { href: "/admin-panel/dashboard/program", label: "Program Management", icon: ListVideo },
  { href: "/admin-panel/dashboard/schedule", label: "TV Schedule", icon: CalendarClock },
];

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  adminName,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
  adminName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/admin/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Logged out successfully");
      router.push("/admin-panel/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-950">
      <div className={`flex items-center gap-2 border-b border-slate-800 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <Tv className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">TV Channel</p>
            <p className="truncate text-xs text-slate-500">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3">
        {!collapsed && (
          <p className="mb-2 truncate px-3 text-xs text-slate-500">Signed in as {adminName}</p>
        )}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-950 hover:text-red-300 disabled:opacity-60 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{loggingOut ? "Logging out…" : "Logout"}</span>}
        </button>

        <button
          onClick={onToggleCollapsed}
          className="mt-1 hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-900 hover:text-slate-200 lg:flex"
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );
}
