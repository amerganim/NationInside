"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, CalendarDays, Megaphone, ShieldCheck, BarChart3, Bell } from "lucide-react";

const BASE = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/notices", label: "Notices", icon: Bell },
  { href: "/app/tasks", label: "Tasks", icon: Target },
  { href: "/app/events", label: "Events", icon: CalendarDays },
  { href: "/app/mobilize", label: "Mobilise", icon: Megaphone },
];

const ADMIN = [
  { href: "/app/insights", label: "Insights", icon: BarChart3 },
  { href: "/app/admin", label: "Admin", icon: ShieldCheck },
];

export default function AppNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...BASE, ...ADMIN] : BASE;
  return (
    <nav className="flex gap-1 overflow-x-auto">
      {items.map((it) => {
        const active = it.href === "/app" ? pathname === "/app" : pathname.startsWith(it.href);
        const Icon = it.icon;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
              active ? "bg-[var(--accent)]/15 text-foreground font-medium" : "text-muted hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Icon size={16} className={active ? "text-[var(--accent)]" : ""} />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
