import type React from "react"
import type { Metadata } from "next"
// Disabled next/font Google import to avoid network fetch during build
// import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sales CRM - Dashboard",
  description: "Modern Sales CRM Interface",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
