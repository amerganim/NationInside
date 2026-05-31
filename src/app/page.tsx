import Link from "next/link";
import {
  IdCard, CalendarCheck, Target, Megaphone, BarChart3, Network, ArrowRight, ShieldCheck,
} from "lucide-react";
import { getLocale, getT } from "@/lib/i18n/server";
import { LocaleProvider } from "@/lib/i18n/client";
import LanguageToggle from "@/components/app/LanguageToggle";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: IdCard, t: "feat.id.t", d: "feat.id.d" },
  { icon: CalendarCheck, t: "feat.events.t", d: "feat.events.d" },
  { icon: Target, t: "feat.missions.t", d: "feat.missions.d" },
  { icon: Megaphone, t: "feat.mobilize.t", d: "feat.mobilize.d" },
  { icon: BarChart3, t: "feat.dashboard.t", d: "feat.dashboard.d" },
  { icon: Network, t: "feat.tree.t", d: "feat.tree.d" },
];

export default async function Landing() {
  const locale = await getLocale();
  const t = await getT();

  return (
    <LocaleProvider locale={locale}>
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="px-5 md:px-10 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl grid place-items-center font-bold text-white"
            style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>N</div>
          <div>
            <div className="font-bold leading-tight">Nation Inside</div>
            <div className="text-[10px] uppercase tracking-widest text-muted">Party OS</div>
          </div>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <Link href="/demo" className="text-sm text-muted hover:text-foreground px-3 py-2 hidden sm:block">{t("landing.viewDemo")}</Link>
          <Link href="/login" className="text-sm font-medium px-3 py-2 rounded-lg border border-border hover:bg-white/5">{t("landing.login")}</Link>
          <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-lg text-white"
            style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>{t("landing.register")}</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 px-5 md:px-10">
        <div className="max-w-5xl mx-auto pt-16 md:pt-24 pb-12 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-border text-muted mb-6">
            <ShieldCheck size={14} className="text-[var(--accent)]" /> {t("landing.badge")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            {t("landing.h1a")}<br /><span className="text-[var(--accent)]">{t("landing.h1b")}</span>
          </h1>
          <p className="text-muted text-lg mt-5 max-w-2xl mx-auto">{t("landing.subtitle")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white"
              style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
              {t("landing.becomeMember")} <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="rounded-xl px-6 py-3.5 font-semibold border border-border hover:bg-white/5">
              {t("landing.memberLogin")}
            </Link>
          </div>
          <Link href="/demo" className="inline-block text-sm text-muted hover:text-[var(--accent)] mt-6">
            {t("landing.exploreDemo")}
          </Link>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {FEATURES.map((f) => (
            <div key={f.t} className="panel p-5">
              <span className="w-10 h-10 rounded-xl grid place-items-center bg-white/5 text-[var(--accent)] inline-flex">
                <f.icon size={20} />
              </span>
              <h3 className="font-semibold mt-3">{t(f.t)}</h3>
              <p className="text-sm text-muted mt-1">{t(f.d)}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 md:px-10 py-6 border-t border-border text-center text-xs text-muted">
        {t("landing.footer")}
      </footer>
    </div>
    </LocaleProvider>
  );
}
