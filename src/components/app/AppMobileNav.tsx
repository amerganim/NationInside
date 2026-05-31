"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { Avatar } from "@/components/ui";
import { MEMBER_NAV, ADMIN_NAV, isActive, type NavItem } from "@/components/app/appNavItems";
import type { SidebarUser } from "@/components/app/AppSidebar";
import { useT } from "@/lib/i18n/client";
import LanguageToggle from "@/components/app/LanguageToggle";

export default function AppMobileNav({ isAdmin, user }: { isAdmin: boolean; user: SidebarUser }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useT();

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function Item({ item }: { item: NavItem }) {
    const active = isActive(item.href, pathname);
    const Icon = item.icon;
    return (
      <Link href={item.href} onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-colors ${
          active ? "bg-[var(--accent)]/15 text-foreground font-medium" : "text-muted hover:text-foreground hover:bg-white/5"
        }`}>
        <Icon size={18} className={active ? "text-[var(--accent)]" : ""} />
        {t(item.labelKey)}
      </Link>
    );
  }

  const drawer = (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
      <div className="absolute left-0 top-0 h-full w-[82%] max-w-[300px] bg-[#0b1322] border-r border-border flex flex-col shadow-2xl">
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl grid place-items-center font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>N</div>
            <div>
              <div className="font-bold leading-tight">Nation Inside</div>
              <div className="text-[10px] uppercase tracking-widest text-muted">{t("chrome.memberPortal")}</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 text-muted hover:text-foreground"><X size={20} /></button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {MEMBER_NAV.map((item) => <Item key={item.href} item={item} />)}
          {isAdmin && (
            <>
              <div className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-widest text-muted">{t("chrome.administration")}</div>
              {ADMIN_NAV.map((item) => <Item key={item.href} item={item} />)}
            </>
          )}
        </nav>

        <div className="px-3 py-2 border-t border-border flex justify-center">
          <LanguageToggle />
        </div>

        <div className="p-3 border-t border-border flex items-center gap-3">
          <Link href="/app/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 min-w-0 flex-1">
            <Avatar initials={user.initials} hue={200} size={36} src={user.photoUrl} />
            <div className="min-w-0 leading-tight">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-[11px] text-muted capitalize">{user.status}</div>
            </div>
          </Link>
          <form action={signOut}>
            <button className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-white/5" title="Sign out"><LogOut size={18} /></button>
          </form>
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
