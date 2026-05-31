"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createTask(formData: FormData) {
  const { profile } = await requireAdmin();
  const db = createAdminClient();
  const { error } = await db.from("tasks").insert({
    title: String(formData.get("title")).trim(),
    description: String(formData.get("description") || "") || null,
    category: String(formData.get("category") || "other"),
    points: Number(formData.get("points") || 10),
    org_node_id: String(formData.get("org_node_id") || "") || profile?.org_node_id || null,
    due_at: formData.get("due_at") ? new Date(String(formData.get("due_at"))).toISOString() : null,
    created_by: profile!.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/app/tasks");
}

export async function acceptTask(formData: FormData) {
  const taskId = String(formData.get("task_id"));
  const { userId } = await requireUser();
  const db = createAdminClient();
  const { error } = await db
    .from("task_assignments")
    .insert({ task_id: taskId, member_id: userId, status: "assigned" });
  if (error && error.code !== "23505") throw new Error(error.message);
  revalidatePath("/app/tasks");
}

export async function submitTask(formData: FormData) {
  const assignmentId = String(formData.get("assignment_id"));
  const { userId } = await requireUser();
  const db = createAdminClient();

  const { data: a } = await db.from("task_assignments").select("member_id").eq("id", assignmentId).single();
  if (!a || a.member_id !== userId) throw new Error("Not your task");

  const lat = formData.get("lat") ? Number(formData.get("lat")) : null;
  const lng = formData.get("lng") ? Number(formData.get("lng")) : null;
  const { error } = await db
    .from("task_assignments")
    .update({
      status: "submitted",
      note: String(formData.get("note") || "") || null,
      photo_url: String(formData.get("photo_url") || "") || null,
      lat,
      lng,
      submitted_at: new Date().toISOString(),
    })
    .eq("id", assignmentId);
  if (error) throw new Error(error.message);
  revalidatePath("/app/tasks");
}

/** Admin reviews a submission. Approve awards the task's points. */
export async function reviewTask(formData: FormData) {
  const { profile } = await requireAdmin();
  const assignmentId = String(formData.get("assignment_id"));
  const approve = String(formData.get("decision")) === "approve";
  const db = createAdminClient();

  const { data: a } = await db
    .from("task_assignments")
    .select("id, member_id, task_id, status, tasks(points)")
    .eq("id", assignmentId)
    .single<{ id: string; member_id: string; task_id: string; status: string; tasks: { points: number } }>();
  if (!a) throw new Error("Submission not found");

  const points = approve ? a.tasks?.points ?? 0 : 0;
  const { error } = await db
    .from("task_assignments")
    .update({
      status: approve ? "approved" : "rejected",
      reviewed_by: profile!.id,
      points_awarded: points,
    })
    .eq("id", assignmentId);
  if (error) throw new Error(error.message);

  if (approve && a.status !== "approved") {
    await db.from("score_events").insert({
      member_id: a.member_id,
      source: "task",
      points,
      ref_id: a.task_id,
    });
  }
  revalidatePath("/app/tasks");
}
