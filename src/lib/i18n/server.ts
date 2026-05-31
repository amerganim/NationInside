import { cookies } from "next/headers";
import { t as translate, type Locale } from "@/lib/i18n/dict";

/** Read the selected locale from the cookie (server side). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get("locale")?.value === "bn" ? "bn" : "en";
}

/** A translator bound to the current locale, for server components. */
export async function getT(): Promise<(key: string) => string> {
  const locale = await getLocale();
  return (key: string) => translate(key, locale);
}
