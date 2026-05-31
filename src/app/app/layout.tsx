import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";
import AppNav from "@/components/app/AppNav";
import { Avatar } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId, email, profile } = await getSession();
  if (!userId) redirect("/login");

  const name = profile?.full_name || email || "Member";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "M";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 glass border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/app" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl grid place-items-center font-bold text-white"
              style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>N</div>
            <span className="font-bold hidden sm:block">Nation Inside</span>
          </Link>

          <AppNav isAdmin={isAdmin(profile)} />

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <Avatar initials={initials} hue={200} size={32} />
              <div className="leading-tight">
                <div className="text-sm font-medium">{name}</div>
                <div className="text-[11px] text-muted capitalize">{profile?.status ?? ""}</div>
              </div>
            </div>
            <form action={signOut}>
              <button className="text-muted hover:text-foreground p-2 rounded-lg hover:bg-white/5" title="Sign out">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-6">{children}</main>
    </div>
  );
}
