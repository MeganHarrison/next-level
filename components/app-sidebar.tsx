"use client"

import type * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Map as MapIcon,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Next Level AI Agents",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Next Level AI Agents",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Next Level AI Agents",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Agents",
      url: "/home",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Business Strategist",
          url: "/home",
        },
        {
          title: "Documentation Agent",
          url: "/documentation-agent",
        },
        {
          title: "Content Creator",
          url: "/content-ideas",
        },
        {
          title: "Travel Blog",
          url: "/travel-blog",
        },
        {
          title: "Home",
          url: "/home",
        },
        {
          title: "Agent",
          url: "/agent",
        },
        {
          title: "Expert",
          url: "/expert-chat",
        },
        {
          title: "Companies",
          url: "/companies",
        },
        {
          title: "Content Ideas",
          url: "/content-ideas",
        },
        {
          title: "Documents",
          url: "/documents",
        },
      ],
    },
    {
      title: "Databases",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Clients",
          url: "#",
        },
        {
          title: "Sales",
          url: "#",
        },
        {
          title: "Products + Services",
          url: "/products",
        },
      ],
    },
    {
      title: "Components",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Tasks",
          url: "/tasks",
        },
        {
          title: "Contacts",
          url: "/contacts",
        },
        {
          title: "Integrations",
          url: "/integrations",
        },
        {
          title: "Dashboard",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: MapIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
