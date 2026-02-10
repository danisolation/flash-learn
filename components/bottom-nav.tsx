"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Plus, Trophy, Gamepad2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Trang chủ",
  },
  {
    href: "/study",
    icon: BookOpen,
    label: "Học",
  },
  {
    href: "/create",
    icon: Plus,
    label: "Tạo mới",
    isCenter: true,
  },
  {
    href: "/game",
    icon: Gamepad2,
    label: "Trò chơi",
  },
  {
    href: "/achievements",
    icon: Trophy,
    label: "Thành tích",
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  // Hide bottom nav on study/[deckId] page
  if (pathname.includes("/study/")) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t shadow-lg md:hidden bottom-nav">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-4"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full gradient-primary shadow-lg shadow-primary/30 transition-all active:scale-95 hover:shadow-xl hover:shadow-primary/40">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-2 transition-all relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "animate-bounce-in")} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-0.5 w-5 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
