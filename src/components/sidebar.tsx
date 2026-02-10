"use client"

import { Link, useLocation } from "react-router-dom"
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
  Trophy,
  Flame,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useGamification } from "@/lib/gamification"
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
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const { state } = useGamification()

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
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <Flame className="h-3.5 w-3.5 text-orange-500 animate-fire" />
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{state.currentStreak}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Zap className="h-3.5 w-3.5 text-yellow-500" />
                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Lv.{state.level}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>XP: <span className="font-semibold text-foreground">{state.totalXp}</span></span>
              <span>Hôm nay: <span className="font-semibold text-foreground">{state.dailyGoal.cardsReviewed}</span> thẻ</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="p-2 border-b flex flex-col items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">{state.currentStreak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Chuỗi: {state.currentStreak} ngày · Lv.{state.level}</p>
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
                    <Link to={item.href}>
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
              <Link key={item.href} to={item.href}>
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
                    <Link to={item.href}>
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
              <Link key={item.href} to={item.href}>
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
