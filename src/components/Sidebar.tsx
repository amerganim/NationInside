"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Network,
  IdCard,
  Megaphone,
  Trophy,
  Vote,
  Sparkles,
  MonitorPlay,
} from "lucide-react";

const NAV = [
  { href: "/", label: "National Dashboard", icon: LayoutDashboard },
  { href: "/hierarchy", label: "Organisation Tree", icon: Network },
  { href: "/members", label: "Members & Digital ID", icon: IdCard },
  { href: "/mobilize", label: "One-Tap Mobilisation", icon: Megaphone },
  { href: "/activity", label: "Activity Score", icon: Trophy },
  { href: "/nominations", label: "Nomination Intelligence", icon: Vote },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 hidden md:flex flex-col border-r border-border bg-[#0b1322]/70 backdrop-blur">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 rounded-xl grid place-items-center font-bold text-white"
          style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
          নি
        </div>
        <div>
          <div className="font-bold leading-tight">NationInside</div>
          <div className="text-[10px] uppercase tracking-widest text-muted">Party OS</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active
                  ? "bg-[var(--accent)]/15 text-foreground font-medium"
                  : "text-muted hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon size={18} className={active ? "text-[var(--accent)]" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          href="/warroom"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white"
          style={{ background: "linear-gradient(135deg, #1f2b4d, #2f80ed)" }}
        >
          <MonitorPlay size={18} />
          Open War Room
        </Link>
        <p className="text-[10px] text-muted text-center mt-3">
          Demo build · mock data
        </p>
      </div>
    </aside>
  );
}
