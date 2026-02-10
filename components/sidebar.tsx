"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  BookOpen, 
  Plus, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  FolderOpen,
  BarChart3,
  Gamepad2,
  Trophy
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { StreakBadge, XpBadge, useStudyStats } from "@/components/study-stats"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Trang chủ",
  },
  {
    href: "/study",
    icon: BookOpen,
    label: "Học tập",
  },
  {
    href: "/decks",
    icon: FolderOpen,
    label: "Bộ thẻ",
  },
  {
    href: "/create",
    icon: Plus,
    label: "Tạo mới",
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

const bottomNavItems = [
  {
    href: "/settings",
    icon: Settings,
    label: "Cài đặt",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { stats } = useStudyStats()

  // Hide sidebar on study/[deckId] page
  if (pathname.includes("/study/") && pathname !== "/study") {
    return null
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 border-r bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b",
          collapsed ? "justify-center" : "gap-2"
        )}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FlashLearn
            </span>
          )}
        </div>

        {/* Stats Section */}
        {!collapsed && (
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <StreakBadge streak={stats.streak} size="sm" />
              <XpBadge xp={stats.totalXp} />
            </div>
            <div className="text-xs text-muted-foreground">
              Hôm nay: <span className="font-semibold text-foreground">{stats.todayCards}</span> thẻ
            </div>
          </div>
        )}

        {collapsed && (
          <div className="p-2 border-b flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
                  <StreakBadge streak={stats.streak} size="sm" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Chuỗi: {stats.streak} ngày</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="icon"
                        className={cn(
                          "w-full h-10",
                          isActive && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-10",
                    isActive && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-2 border-t space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="icon"
                        className="w-full h-10"
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start h-10"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            )
          })}

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn("w-full h-10", !collapsed && "justify-start")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-3" />
                Thu gọn
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
