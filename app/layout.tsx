import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FlashcardProvider } from "@/components/flashcard-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlashLearn - Ứng dụng học tiếng Anh",
  description: "Ứng dụng flash card hỗ trợ học tiếng Anh với thiết kế hiện đại và đầy đủ tính năng",
    generator: 'v0.dev'
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
            {children}
            <Toaster />
          </FlashcardProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
