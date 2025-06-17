import React from "react"
import type { Metadata } from "next"
import { Nunito_Sans } from "next/font/google"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import DynamicBreadcrumbs from "@/components/DynamicBreadcrumbs";

// Use Nunito Sans for body text
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Next Level AI Agents",
  description: "Your Business on Turbodrive",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
      <html lang="en" suppressHydrationWarning className={`${nunitoSans.variable}`}>
      <body className="bg-white text-[#333333] antialiased">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumbs />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      </body>
    </html>
  )
}
