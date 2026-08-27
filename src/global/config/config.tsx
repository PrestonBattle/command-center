import { IconLayoutDashboard, IconLifebuoy, IconSettings, IconSpeakerphone, IconUserPlus, IconUsers } from "@tabler/icons-react";
import { ReactNode } from "react";

export interface NavbarItem {
  icon: ReactNode;
  label: string;
  href: string;
}

export const APPCONFIG = {

  table: {
    members: "Members",
    org: "Org",
    clients: "Client",
    org_client: "Org_Client",
    lead: "Lead",
    campaign: "Campaign",
  },
  hiddenRoutes: ["/auth", ],
  
  navbar: [
    { href: "/",           label: "Dashboard", icon: <IconLayoutDashboard size={20} stroke={1.6} /> },
    { href: "/clients",    label: "Clients",   icon: <IconUsers size={20} stroke={1.6} /> },
    { href: "/leads",      label: "Leads",     icon: <IconUserPlus size={20} stroke={1.6} /> },
    { href: "/campaigns",  label: "Campaigns", icon: <IconSpeakerphone size={20} stroke={1.6} /> },
    { href: "/life-vest",  label: "Life vest", icon: <IconLifebuoy size={20} stroke={1.6} /> },
  ],
  navbarFooter: [
    { href: "/settings",   label: "Settings",  icon: <IconSettings size={20} stroke={1.6} /> },
  ],



}