// Hand-written DB types mirroring supabase/migrations/0001_init.sql.
// (Later you can replace this with `supabase gen types typescript`.)

export type UserRole = "member" | "admin" | "super_admin";
export type MemberStatus = "pending" | "active" | "suspended";
export type OrgLevel = "national" | "division" | "district" | "upazila" | "union" | "ward";
export type TaskCategory = "relief" | "plantation" | "blood" | "rally" | "survey" | "recruitment" | "other";
export type AssignmentStatus = "assigned" | "in_progress" | "submitted" | "approved" | "rejected";
export type MobilResponse = "coming" | "enroute" | "declined";

export interface OrgNode {
  id: string;
  parent_id: string | null;
  level: OrgLevel;
  name: string;
  name_bn: string | null;
  path: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  name_bn: string | null;
  phone: string | null;
  photo_url: string | null;
  designation: string;
  org_node_id: string | null;
  role: UserRole;
  status: MemberStatus;
  activity_score: number;
  joined_at: string;
  verified_by: string | null;
  verified_at: string | null;
}

export interface EventRow {
  id: string;
  title: string;
  description: string | null;
  org_node_id: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  starts_at: string;
  ends_at: string | null;
  expected: number;
  qr_token: string;
  created_by: string | null;
  created_at: string;
}

export interface EventAttendance {
  id: string;
  event_id: string;
  member_id: string;
  method: string;
  lat: number | null;
  lng: number | null;
  checked_in_at: string;
}

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  category: TaskCategory;
  org_node_id: string | null;
  points: number;
  due_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  member_id: string;
  status: AssignmentStatus;
  note: string | null;
  photo_url: string | null;
  lat: number | null;
  lng: number | null;
  submitted_at: string | null;
  reviewed_by: string | null;
  points_awarded: number;
  created_at: string;
}

export interface Mobilization {
  id: string;
  title: string;
  org_node_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface MobilizationResponse {
  id: string;
  mobilization_id: string;
  member_id: string;
  response: MobilResponse;
  lat: number | null;
  lng: number | null;
  responded_at: string;
}

export type ComplaintStatus = "submitted" | "assigned" | "in_progress" | "solved" | "rejected";

export interface Complaint {
  id: string;
  title: string;
  description: string | null;
  category: string;
  photo_url: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  status: ComplaintStatus;
  org_node_id: string | null;
  submitted_by: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notice {
  id: string;
  title: string;
  body: string | null;
  pinned: boolean;
  org_node_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ScoreEvent {
  id: string;
  member_id: string;
  source: string;
  points: number;
  ref_id: string | null;
  created_at: string;
}
