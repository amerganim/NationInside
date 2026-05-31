import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, isAdmin } from "@/lib/auth/session";
import AppSidebar, { type SidebarUser } from "@/components/app/AppSidebar";
import AppMobileNav from "@/components/app/AppMobileNav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId, email, profile } = await getSession();
  if (!userId) redirect("/login");

  const name = profile?.full_name || email || "Member";
  const user: SidebarUser = {
    name,
    status: profile?.status ?? "",
    photoUrl: profile?.photo_url ?? null,
    initials: name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "M",
  };
  const admin = isAdmin(profile);

  return (
    <div className="flex">
      <AppSidebar isAdmin={admin} user={user} />
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 glass border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AppMobileNav isAdmin={admin} user={user} />
            <Link href="/app" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg grid place-items-center font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>N</div>
              <span className="font-bold">Nation Inside</span>
            </Link>
          </div>
        </header>

        <main className="px-4 md:px-8 py-6 max-w-[1200px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
