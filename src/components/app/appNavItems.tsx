import {
  Home, Bell, Target, CalendarDays, Megaphone, MessageSquareWarning, FileText,
  BarChart3, ShieldCheck, Search, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  labelKey: string;
  icon: LucideIcon;
}

export const MEMBER_NAV: NavItem[] = [
  { href: "/app", label: "Home", labelKey: "nav.home", icon: Home },
  { href: "/app/notices", label: "Notices", labelKey: "nav.notices", icon: Bell },
  { href: "/app/tasks", label: "Tasks", labelKey: "nav.tasks", icon: Target },
  { href: "/app/events", label: "Events", labelKey: "nav.events", icon: CalendarDays },
  { href: "/app/mobilize", label: "Mobilise", labelKey: "nav.mobilize", icon: Megaphone },
  { href: "/app/complaints", label: "Complaints", labelKey: "nav.complaints", icon: MessageSquareWarning },
  { href: "/app/documents", label: "Documents", labelKey: "nav.documents", icon: FileText },
];

export const ADMIN_NAV: NavItem[] = [
  { href: "/app/insights", label: "Leader Dashboard", labelKey: "nav.insights", icon: BarChart3 },
  { href: "/app/search", label: "Smart Search", labelKey: "nav.search", icon: Search },
  { href: "/app/admin", label: "Verify Members", labelKey: "nav.verify", icon: ShieldCheck },
];

export function isActive(href: string, pathname: string): boolean {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}
