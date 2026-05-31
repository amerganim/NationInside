"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

/** A member updates their own profile (RLS-scoped — privileged fields are blocked by trigger). */
export async function updateProfile(formData: FormData) {
  const { userId } = await requireUser();
  const supabase = await createClient();

  const update: Record<string, string | null> = {
    full_name: String(formData.get("full_name") || "").trim(),
    name_bn: String(formData.get("name_bn") || "").trim() || null,
    phone: String(formData.get("phone") || "").trim() || null,
  };
  const photo = String(formData.get("photo_url") || "");
  if (photo) update.photo_url = photo;

  if (!update.full_name) throw new Error("Name is required");

  const { error } = await supabase.from("profiles").update(update).eq("id", userId);
  if (error) throw new Error(error.message);

  revalidatePath("/app");
  revalidatePath("/app/profile");
}
