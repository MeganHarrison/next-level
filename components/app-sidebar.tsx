"use client"

import type * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Sheet,
  Command,
  File,
  GalleryVerticalEnd,
  Plane,
  Settings2,
  Rocket,
  Pencil,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Agents",
      url: "/",
      icon: Rocket,
      isActive: true,
      items: [
        {
          title: "Business Expert",
          url: "/agents/business_expert",
        },
        {
          title: "Crawl4ai",
          url: "/agents/agent_crawl4ai",
        },
        {
          title: "N8N Chat",
          url: "/agents/n8n-rag",
        },
        {
          title: "Expert Chat 2",
          url: "/agents/expert-chat2",
        },
        {
          title: "Rag Demo",
          url: "/agents/rag-demo",
        },
        {
          title: "Rag Query",
          url: "/agents/rag-query",
        },
      ],
    },
    {
      title: "Pages",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Documents",
          url: "/databases/documents",
        },
        {
          title: "Deals",
          url: "/deals",
        },
        {
          title: "Integrations",
          url: "/integrations",
        },
        {
          title: "Tasks",
          url: "/tasks",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: true,
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
          title: "Billing",
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
      name: "Documents",
      url: "/databases/documents3",
      icon: File,
    },
    {
      name: "Travel Blog",
      url: "/databases/travel-blog",
      icon: Plane,
    },
    {
      name: "Content Ideas",
      url: "/databases/content-ideas",
      icon: Pencil,
    },
    {
      name: "SOPs",
      url: "/databases/content-ideas",
      icon: BookOpen,
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
