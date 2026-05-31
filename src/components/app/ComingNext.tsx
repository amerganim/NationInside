import { Wrench } from "lucide-react";

export default function ComingNext({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="panel p-8 text-center">
        <div className="w-12 h-12 rounded-xl grid place-items-center mx-auto mb-4 bg-white/5 text-[var(--accent)]">
          <Wrench size={22} />
        </div>
        <p className="text-muted max-w-md mx-auto">{desc}</p>
        <p className="text-xs text-muted mt-3">Being built in the next step — the database schema already supports it.</p>
      </div>
    </div>
  );
}
