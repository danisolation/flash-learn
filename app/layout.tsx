import type React from "react"
import "@/app/globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FlashcardProvider } from "@/components/flashcard-provider"
import { GamificationProvider } from "@/lib/gamification"
import Sidebar from "@/components/sidebar"
import BottomNav from "@/components/bottom-nav"

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "FlashLearn - Ứng dụng học tiếng Anh thông minh",
  description: "Ứng dụng flash card thông minh với spaced repetition, gamification, và AI hỗ trợ học tiếng Anh hiệu quả",
  generator: 'v0.dev',
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FlashLearn",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FlashcardProvider>
            <GamificationProvider>
              <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
                <Sidebar />
                <main className="flex-1 pb-20 md:pb-0 min-h-screen">
                  {children}
                </main>
              </div>
              <BottomNav />
              <Toaster />
            </GamificationProvider>
          </FlashcardProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
