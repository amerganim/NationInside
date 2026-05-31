import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Panel } from "@/components/ui";
import ProfileEditForm from "@/components/app/ProfileEditForm";
import EnableNotifications from "@/components/app/EnableNotifications";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { userId, email, profile } = await getSession();
  if (!userId) redirect("/login");

  const name = profile?.full_name || email || "Member";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "M";
  const t = await getT();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link href="/app" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft size={16} /> {t("profile.back")}
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
        <p className="text-muted mt-1">{t("profile.subtitle")}</p>
      </div>
      <Panel>
        <ProfileEditForm
          userId={userId}
          initial={{
            full_name: profile?.full_name ?? "",
            name_bn: profile?.name_bn ?? null,
            phone: profile?.phone ?? null,
            photo_url: profile?.photo_url ?? null,
            initials,
          }}
        />
      </Panel>

      <Panel title={t("profile.notifications")} subtitle={t("profile.notificationsSub")}>
        <EnableNotifications />
      </Panel>
    </div>
  );
}
