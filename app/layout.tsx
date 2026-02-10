import type React from "react"
import "@/app/globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FlashcardProvider } from "@/components/flashcard-provider"
import Sidebar from "@/components/sidebar"
import BottomNav from "@/components/bottom-nav"

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "FlashLearn - Ứng dụng học tiếng Anh",
  description: "Ứng dụng flash card hỗ trợ học tiếng Anh với thiết kế hiện đại và đầy đủ tính năng",
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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FlashcardProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 pb-20 md:pb-0">
                {children}
              </main>
            </div>
            <BottomNav />
            <Toaster />
          </FlashcardProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
