import {
  LayoutDashboard,
  Network,
  IdCard,
  Megaphone,
  Trophy,
  Vote,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const DEMO_NAV: NavItem[] = [
  { href: "/demo", label: "National Dashboard", icon: LayoutDashboard },
  { href: "/demo/hierarchy", label: "Organisation Tree", icon: Network },
  { href: "/demo/members", label: "Members & Digital ID", icon: IdCard },
  { href: "/demo/mobilize", label: "One-Tap Mobilisation", icon: Megaphone },
  { href: "/demo/activity", label: "Activity Score", icon: Trophy },
  { href: "/demo/nominations", label: "Nomination Intelligence", icon: Vote },
  { href: "/demo/assistant", label: "AI Assistant", icon: Sparkles },
];
