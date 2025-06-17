import type {Metadata} from "next";
import { Nunito_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"

const nunitoSans = Nunito_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
  })

export const metadata: Metadata = {
    title: "Supabase + TanStack Table Demo",
    description: "A demo app that fetches and filters data from Supabase on the server side and displays it in a TanStack Table with modern UI styling.",
    keywords: "Supabase, TanStack Table, Shadcn, UI, TailwindCSS, Data Visualization, Lazy Loading, Filtering, PostgreSQL",
    authors: [{ name: "thisisfel1x", url: "https://github.com/thisisfel1x" }],
    openGraph: {
        title: "Supabase + TanStack Table Demo",
        description: "Explore server-side data fetching and filtering with Supabase, displayed in TanStack Table with modern UI elements.",
        url: "https://github.com/thisisfel1x/supabase-shadcn-database-example",
        siteName: "Supabase + TanStack Table Demo",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Supabase + TanStack Table Demo",
        description: "A modern app showcasing Supabase integration and TanStack Table data visualization.",
    },
};


export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${nunitoSans.variable} ${nunitoSans.variable} antialiased`}
        >
        {children}
        <Analytics />
        </body>
        </html>
    );
}
