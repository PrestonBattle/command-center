import {
  IconCash,
  IconLayoutDashboard,
  IconLifebuoy,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import type { ReactNode } from "react";

/** One link in the main navigation (sidebar on desktop, tab bar on phones). */
export interface NavbarItem {
  icon: ReactNode;
  label: string;
  href: string;
}

const ICON = { size: 20, stroke: 1.6 } as const;

/** App-wide settings that more than one component reads. */
export const APPCONFIG = {
  navbar: [
    { href: "/", label: "Dashboard", icon: <IconLayoutDashboard {...ICON} /> },
    { href: "/clients", label: "Clients", icon: <IconUsers {...ICON} /> },
    { href: "/leads", label: "Leads", icon: <IconUserPlus {...ICON} /> },
    { href: "/money", label: "Money", icon: <IconCash {...ICON} /> },
    { href: "/life-vest", label: "Life vest", icon: <IconLifebuoy {...ICON} /> },
  ] satisfies NavbarItem[],
};
