import Link from "next/link";
import {
  IdCard, CalendarCheck, Target, Megaphone, BarChart3, Network, ArrowRight, ShieldCheck,
} from "lucide-react";

const FEATURES = [
  { icon: IdCard, title: "Digital Member ID", desc: "Every member carries a verifiable QR ID, approved by your committee admins." },
  { icon: CalendarCheck, title: "Events & Attendance", desc: "Create rallies and meetings; members check in with a QR scan." },
  { icon: Target, title: "Missions & Scoring", desc: "Assign tasks, collect geo-tagged proof, and reward real activity." },
  { icon: Megaphone, title: "Live Mobilisation", desc: "Issue a call-up; watch members respond in real time." },
  { icon: BarChart3, title: "Leader Dashboard", desc: "Live intelligence on membership, activity and reach." },
  { icon: Network, title: "Organisation Tree", desc: "Your full structure — national down to ward — in one place." },
];

export default function Landing() {
  return (
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
          <Link href="/demo" className="text-sm text-muted hover:text-foreground px-3 py-2">View demo</Link>
          <Link href="/login" className="text-sm font-medium px-3 py-2 rounded-lg border border-border hover:bg-white/5">Login</Link>
          <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-lg text-white"
            style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>Register</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 px-5 md:px-10">
        <div className="max-w-5xl mx-auto pt-16 md:pt-24 pb-12 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-border text-muted mb-6">
            <ShieldCheck size={14} className="text-[var(--accent)]" /> Secure · members verified by your admins
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Your party,<br /><span className="text-[var(--accent)]">organised and mobilised.</span>
          </h1>
          <p className="text-muted text-lg mt-5 max-w-2xl mx-auto">
            A digital operating system for political organisations — membership,
            events, missions, scoring and real-time mobilisation, all in one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white"
              style={{ background: "linear-gradient(135deg, var(--bd-green), var(--accent))" }}>
              Become a member <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="rounded-xl px-6 py-3.5 font-semibold border border-border hover:bg-white/5">
              Member login
            </Link>
          </div>
          <Link href="/demo" className="inline-block text-sm text-muted hover:text-[var(--accent)] mt-6">
            Or explore the interactive demo →
          </Link>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {FEATURES.map((f) => (
            <div key={f.title} className="panel p-5">
              <span className="w-10 h-10 rounded-xl grid place-items-center bg-white/5 text-[var(--accent)] inline-flex">
                <f.icon size={20} />
              </span>
              <h3 className="font-semibold mt-3">{f.title}</h3>
              <p className="text-sm text-muted mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 md:px-10 py-6 border-t border-border text-center text-xs text-muted">
        Nation Inside · Party Operating System · built for Bangladesh
      </footer>
    </div>
  );
}
