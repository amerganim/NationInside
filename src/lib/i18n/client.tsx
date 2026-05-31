"use client";

import { createContext, useContext, type ReactNode } from "react";
import { t as translate, type Locale } from "@/lib/i18n/dict";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Returns a translator bound to the current locale. */
export function useT() {
  const locale = useContext(LocaleContext);
  return (key: string) => translate(key, locale);
}
