import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n/dict";

/** Read the selected locale from the cookie (server side). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get("locale")?.value === "bn" ? "bn" : "en";
}
