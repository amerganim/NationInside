"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MonitorPlay } from "lucide-react";
import { DEMO_NAV as NAV } from "@/components/demoNav";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  // Close on route change and lock body scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const drawer = (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
      <div className="absolute left-0 top-0 h-full w-[80%] max-w-[300px] bg-[#0b1322] border-r border-border flex flex-col shadow-2xl">
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>N</div>
            <div>
              <div className="font-bold leading-tight">Nation Inside</div>
              <div className="text-[10px] uppercase tracking-widest text-muted">Party OS</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = item.href === "/demo" ? pathname === "/demo" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${
                  active ? "bg-[var(--accent)]/15 text-foreground font-medium" : "text-muted hover:text-foreground hover:bg-white/5"
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
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #1f2b4d, #2f80ed)" }}
          >
            <MonitorPlay size={18} /> Open War Room
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 -ml-2 rounded-lg text-foreground hover:bg-white/5">
        <Menu size={22} />
      </button>
      {mounted && open && createPortal(drawer, document.body)}
    </div>
  );
}
