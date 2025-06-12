"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Cog,
  Database,
  FileText,
  PanelLeft,
  ShoppingCart,
  Sparkles,
  Users,
  Video,
  Bot,
  Pencil,
  BarChart3,
  BookOpen,
  LogOut,
  Building,
  CheckSquare,
  Map,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    // Only attempt to get user and set up auth listener if supabase client exists
    if (supabase) {
      const getUser = async () => {
        try {
          const { data } = await supabase.auth.getUser()
          setUser(data.user)
        } catch (error) {
          console.error("Error fetching user:", error)
        }
      }

      getUser()

      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session?.user)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
        }
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    }
  }

  // Define the menu structure with only existing routes
  const menuItems = [
    {
      title: "AI Agents",
      icon: Sparkles,
      submenu: [
        {
          title: "Business Expert",
          href: "/chat",
          icon: Bot,
        },
        {
          title: "Documentation Expert",
          href: "/documentation-agent",
          icon: BookOpen,
        },
        {
          title: "Copywriter Agent",
          href: "/copywriter",
          icon: Pencil,
        },
        {
          title: "Content Creator",
          href: "/content",
          icon: Pencil,
        },
        {
          title: "YouTube Analyzer",
          href: "/youtube",
          icon: Video,
        },
      ],
    },
    {
      title: "Databases",
      icon: Database,
      submenu: [
        {
          title: "Project Jobs",
          href: "/projects-db",
          icon: CheckSquare,
        },
        {
          title: "Companies",
          href: "/companies-db",
          icon: Building,
        },
        {
          title: "Services",
          href: "/services",
          icon: ShoppingCart,
        },
        {
          title: "Customers",
          href: "/customers",
          icon: Users,
        },
        {
          title: "Prospects",
          href: "/prospects",
          icon: Users,
        },
        {
          title: "Documents",
          href: "/documents",
          icon: FileText,
        },
        {
          title: "Sales",
          href: "/sales",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "Sitemap",
      icon: Map,
      href: "/sitemap",
    },
    {
      title: "Settings",
      icon: Cog,
      href: "/settings",
    },
  ]

  return (
    <div
      className={cn(
        "sidebar-transition relative flex flex-col h-screen border-r border-gray-100 bg-white z-50",
        collapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      {/* Keep the header section the same */}
      <div className="flex items-center h-[73px] px-5">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between w-full")}>
          {collapsed ? (
            <Link href="/" className="text-l font-sans font-bold tracking-tight">
              <span>AI</span>
            </Link>
          ) : (
            <Link href="/" className="text-xs font-sans font-bold tracking-tight">
              <span>Alleato AI Agents</span>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft size={18} className={collapsed ? "rotate-180" : ""} />
          </button>
        </div>
      </div>

      {/* Keep the navigation section the same */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item, index) => {
            // If the item has a direct href (no submenu)
            if (item.href && !item.submenu) {
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center h-10 px-3 rounded-md text-sm transition-colors",
                    isActive ? "bg-gray-50 text-black" : "text-gray-500 hover:text-black hover:bg-gray-50",
                    collapsed && "justify-center",
                  )}
                >
                  <item.icon size={18} strokeWidth={1.5} />
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              )
            }

            // Render submenu items if not collapsed
            if (item.submenu && !collapsed) {
              return item.submenu.map((subItem, subIndex) => {
                const isActive = pathname === subItem.href
                return (
                  <Link
                    key={subIndex}
                    href={subItem.href}
                    className={cn(
                      "flex items-center h-9 pl-9 pr-3 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-gray-50 text-black"
                        : "text-gray-500 hover:text-black hover:bg-gray-50"
                    )}
                  >
                    <subItem.icon size={16} strokeWidth={1.5} className="mr-2" />
                    <span>{subItem.title}</span>
                  </Link>
                )
              })
            }

            return null
          })}
        </nav>
      </div>

      {/* Update the footer section to handle the case when user is null */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="/diverse-avatars.png" alt="User avatar" className="h-full w-full object-cover" />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.email ? user.email.split("@")[0] : "Guest User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || (supabase ? "Not signed in" : "Supabase not configured")}
                </p>
              </div>
            )}
          </div>
          {!collapsed && supabase && (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-500 hover:text-gray-700">
              <LogOut size={16} />
            </Button>
          )}
        </div>
        {collapsed && supabase && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="mt-2 w-full text-gray-500 hover:text-gray-700"
          >
            <LogOut size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}
