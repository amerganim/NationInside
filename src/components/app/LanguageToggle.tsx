"use client";

import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { useLocale } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/dict";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();

  function set(l: Locale) {
    if (l === locale) return;
    document.cookie = `locale=${l}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 text-xs">
      <Languages size={14} className="text-muted ml-1" />
      {(["en", "bn"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => set(l)}
          className={`px-2 py-1 rounded-md transition-colors ${
            locale === l ? "bg-[var(--accent)]/20 text-foreground font-medium" : "text-muted hover:text-foreground"
          }`}
        >
          {l === "en" ? "EN" : "বাংলা"}
        </button>
      ))}
    </div>
  );
}
