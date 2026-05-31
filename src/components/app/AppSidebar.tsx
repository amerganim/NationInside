"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/actions";
import { Avatar } from "@/components/ui";
import { MEMBER_NAV, ADMIN_NAV, isActive, type NavItem } from "@/components/app/appNavItems";
import { useT } from "@/lib/i18n/client";
import LanguageToggle from "@/components/app/LanguageToggle";

export interface SidebarUser {
  name: string;
  status: string;
  photoUrl: string | null;
  initials: string;
}

function Item({ item, pathname, label }: { item: NavItem; pathname: string; label: string }) {
  const active = isActive(item.href, pathname);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
        active ? "bg-[var(--accent)]/15 text-foreground font-medium" : "text-muted hover:text-foreground hover:bg-white/5"
      }`}
    >
      <Icon size={18} className={active ? "text-[var(--accent)]" : ""} />
      {label}
    </Link>
  );
}

export default function AppSidebar({ isAdmin, user }: { isAdmin: boolean; user: SidebarUser }) {
  const pathname = usePathname();
  const t = useT();
  return (
    <aside className="w-[240px] shrink-0 h-screen sticky top-0 hidden md:flex flex-col border-r border-border bg-[#0b1322]/70 backdrop-blur">
      <Link href="/app" className="px-5 py-5 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 rounded-xl grid place-items-center font-bold text-white"
          style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>N</div>
        <div>
          <div className="font-bold leading-tight">Nation Inside</div>
          <div className="text-[10px] uppercase tracking-widest text-muted">{t("chrome.memberPortal")}</div>
        </div>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {MEMBER_NAV.map((item) => <Item key={item.href} item={item} pathname={pathname} label={t(item.labelKey)} />)}
        {isAdmin && (
          <>
            <div className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-widest text-muted">{t("chrome.administration")}</div>
            {ADMIN_NAV.map((item) => <Item key={item.href} item={item} pathname={pathname} label={t(item.labelKey)} />)}
          </>
        )}
      </nav>

      <div className="px-3 py-2 border-t border-border flex justify-center">
        <LanguageToggle />
      </div>

      <div className="p-3 border-t border-border flex items-center gap-3">
        <Link href="/app/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80">
          <Avatar initials={user.initials} hue={200} size={36} src={user.photoUrl} />
          <div className="min-w-0 leading-tight">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-[11px] text-muted capitalize">{user.status}</div>
          </div>
        </Link>
        <form action={signOut}>
          <button className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-white/5" title={t("chrome.signOut")}>
            <LogOut size={18} />
          </button>
        </form>
      </div>
    </aside>
  );
}
