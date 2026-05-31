"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Sparkles, Send, User } from "lucide-react";
import {
  getAllDistricts,
  getTopMembers,
  getNational,
  fmt,
} from "@/lib/data";

interface Msg {
  id: number;
  role: "user" | "ai";
  content: ReactNode;
}

const SUGGESTIONS = [
  "Show inactive districts",
  "Which district has the highest volunteer activity?",
  "Generate a speech about youth employment",
  "Which districts need attention?",
];

/** Scripted "AI": keyword-matches the query and answers using real mock data. */
function respond(q: string): ReactNode {
  const s = q.toLowerCase();
  const districts = getAllDistricts();

  if (s.includes("inactive") || s.includes("need") || s.includes("attention")) {
    const weak = [...districts].filter((d) => d.activityScore < 50).sort((a, b) => a.activityScore - b.activityScore).slice(0, 6);
    return (
      <div>
        <p className="mb-2">I found <b>{weak.length}</b> districts with an organisational health score below 50. These need leadership attention:</p>
        <ul className="space-y-1">
          {weak.map((d) => (
            <li key={d.id} className="flex justify-between gap-4 text-sm">
              <span>📍 {d.name}</span>
              <span className="text-muted">health {d.activityScore} · {fmt(d.activeCount)} active</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-muted text-sm">Recommendation: schedule organiser visits and a recruitment drive in the bottom three.</p>
      </div>
    );
  }

  if (s.includes("highest") || s.includes("most active") || s.includes("volunteer")) {
    const top = [...districts].sort((a, b) => b.volunteerCount - a.volunteerCount)[0];
    const topScore = [...districts].sort((a, b) => b.activityScore - a.activityScore)[0];
    return (
      <div>
        <p><b>{top.name}</b> leads on volunteer activity with <b>{fmt(top.volunteerCount)}</b> active volunteers and {fmt(top.activeCount)} active members.</p>
        <p className="mt-2 text-muted text-sm">By overall health score, <b className="text-foreground">{topScore.name}</b> ranks #1 at {topScore.activityScore}/100.</p>
      </div>
    );
  }

  if (s.includes("speech") || s.includes("youth") || s.includes("employment")) {
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        <p className="text-muted italic">Draft speech — Youth Employment (≈90 seconds):</p>
        <p>“Brothers and sisters, our greatest strength is not in our slogans — it is in the millions of young hands ready to build this nation. Today, too many of our youth carry degrees but no jobs, talent but no opportunity.</p>
        <p>We pledge a future where every district has a skills and enterprise centre, where young entrepreneurs get fair credit, and where no graduate waits years for a chance to serve. The energy of our youth will not be wasted — it will be the engine of a new Bangladesh.</p>
        <p>Join us. Build with us. The future belongs to those who work for it — and that future starts now.”</p>
      </div>
    );
  }

  if (s.includes("top") || s.includes("best") || s.includes("performer")) {
    const top = getTopMembers(5);
    return (
      <div>
        <p className="mb-2">Your top 5 volunteers nationwide by activity score:</p>
        <ul className="space-y-1 text-sm">
          {top.map((m, i) => (
            <li key={m.id} className="flex justify-between gap-4">
              <span>{i + 1}. {m.name} <span className="text-muted">({m.districtName})</span></span>
              <span className="text-[var(--accent)] font-medium">{m.activityScore}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const nat = getNational();
  return (
    <div>
      <p>I can analyse your organisation in real time. Right now you have <b>{fmt(nat.memberCount)}</b> members and <b>{fmt(nat.activeCount)}</b> active across 64 districts.</p>
      <p className="mt-2 text-muted text-sm">Try asking about inactive districts, top volunteers, the strongest region, or ask me to draft a speech.</p>
    </div>
  );
}

export default function AssistantChat() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      role: "ai",
      content: (
        <p>Hello, General Secretary. I’m your Nation Inside assistant. Ask me anything about the organisation — or tap a suggestion below.</p>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, thinking]);

  function ask(q: string) {
    if (!q.trim() || thinking) return;
    const userMsg: Msg = { id: idRef.current++, role: "user", content: q };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    const answer = respond(q);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: idRef.current++, role: "ai", content: answer }]);
      setThinking(false);
    }, 850);
  }

  return (
    <div className="panel flex flex-col h-[640px] max-w-3xl">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <span className="w-8 h-8 rounded-lg grid place-items-center text-white" style={{ background: "linear-gradient(135deg,#7b5cff,#2f80ed)" }}>
          <Sparkles size={16} />
        </span>
        <div>
          <div className="font-semibold text-sm">Nation Inside Assistant</div>
          <div className="text-[11px] text-muted">Demo · scripted responses on real data</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {msgs.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <span className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${m.role === "ai" ? "text-white" : "bg-[#0d1626] text-muted"}`}
              style={m.role === "ai" ? { background: "linear-gradient(135deg,#7b5cff,#2f80ed)" } : undefined}>
              {m.role === "ai" ? <Sparkles size={15} /> : <User size={15} />}
            </span>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-[var(--accent-2)]/20" : "bg-[#0d1626] border border-border"}`}>
              {m.content}
            </div>
          </motion.div>
        ))}
        {thinking && (
          <div className="flex gap-3">
            <span className="w-8 h-8 rounded-lg grid place-items-center text-white shrink-0" style={{ background: "linear-gradient(135deg,#7b5cff,#2f80ed)" }}>
              <Sparkles size={15} />
            </span>
            <div className="rounded-2xl px-4 py-3 bg-[#0d1626] border border-border flex gap-1">
              <Dot /> <Dot d={0.15} /> <Dot d={0.3} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-5 pb-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => ask(s)} className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-[var(--accent)] transition-colors">
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(input); }}
        className="p-3 border-t border-border flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your organisation…"
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0d1626] border border-border outline-none focus:border-[var(--accent)] text-sm"
        />
        <button type="submit" className="px-4 rounded-xl text-white grid place-items-center" style={{ background: "linear-gradient(135deg,#7b5cff,#2f80ed)" }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function Dot({ d = 0 }: { d?: number }) {
  return (
    <motion.span
      className="w-2 h-2 rounded-full bg-muted inline-block"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1, delay: d }}
    />
  );
}
