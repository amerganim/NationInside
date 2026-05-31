import {
  Home, Bell, Target, CalendarDays, Megaphone, MessageSquareWarning, FileText,
  BarChart3, ShieldCheck, Search, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const MEMBER_NAV: NavItem[] = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/notices", label: "Notices", icon: Bell },
  { href: "/app/tasks", label: "Tasks", icon: Target },
  { href: "/app/events", label: "Events", icon: CalendarDays },
  { href: "/app/mobilize", label: "Mobilise", icon: Megaphone },
  { href: "/app/complaints", label: "Complaints", icon: MessageSquareWarning },
  { href: "/app/documents", label: "Documents", icon: FileText },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/app/insights", label: "Leader Dashboard", icon: BarChart3 },
  { href: "/app/search", label: "Smart Search", icon: Search },
  { href: "/app/admin", label: "Verify Members", icon: ShieldCheck },
];

export function isActive(href: string, pathname: string): boolean {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}
