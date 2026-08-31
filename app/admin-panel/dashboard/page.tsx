import Link from "next/link";
import { Image as ImageIcon, Clapperboard, CalendarClock, ArrowRight } from "lucide-react";
import { getDb, COLLECTIONS } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const db = await getDb();
    const [heroCount, teledramaCount, scheduleCount] = await Promise.all([
      db.collection(COLLECTIONS.heroes).countDocuments(),
      db.collection(COLLECTIONS.teledramas).countDocuments(),
      db.collection(COLLECTIONS.schedules).countDocuments(),
    ]);
    return { heroCount, teledramaCount, scheduleCount, error: null as string | null };
  } catch {
    return { heroCount: 0, teledramaCount: 0, scheduleCount: 0, error: "Could not connect to the database." };
  }
}

export default async function DashboardOverviewPage() {
  const session = await getServerSession();
  const { heroCount, teledramaCount, scheduleCount, error } = await getStats();

  const cards = [
    {
      href: "/admin-panel/dashboard/hero",
      label: "Hero Slides",
      count: heroCount,
      icon: ImageIcon,
      color: "bg-indigo-600",
    },
    {
      href: "/admin-panel/dashboard/teledrama",
      label: "Teledramas",
      count: teledramaCount,
      icon: Clapperboard,
      color: "bg-fuchsia-600",
    },
    {
      href: "/admin-panel/dashboard/schedule",
      label: "Schedule Items",
      count: scheduleCount,
      icon: CalendarClock,
      color: "bg-emerald-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back{session ? `, ${session.name}` : ""}</h1>
        <p className="mt-1 text-sm text-slate-500">Here&apos;s a quick overview of your channel content.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-800 bg-amber-950/40 px-4 py-3 text-sm text-amber-300">
          {error} Check your <code className="rounded bg-black/30 px-1">MONGODB_URI</code> environment variable.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{card.count}</p>
                  <p className="text-sm text-slate-400">{card.label}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-slate-300" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
