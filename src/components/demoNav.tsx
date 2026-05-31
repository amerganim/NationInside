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
  { href: "/", label: "National Dashboard", icon: LayoutDashboard },
  { href: "/hierarchy", label: "Organisation Tree", icon: Network },
  { href: "/members", label: "Members & Digital ID", icon: IdCard },
  { href: "/mobilize", label: "One-Tap Mobilisation", icon: Megaphone },
  { href: "/activity", label: "Activity Score", icon: Trophy },
  { href: "/nominations", label: "Nomination Intelligence", icon: Vote },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles },
];
