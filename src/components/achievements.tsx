"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Trophy, 
  Lock, 
  CheckCircle2, 
  Star,
  Flame,
  Target,
  Zap,
  BookOpen,
  Clock,
  Sparkles
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Achievement } from "@/lib/gamification"

interface AchievementCardProps {
  achievement: Achievement
  onClaim?: () => void
}

export function AchievementCard({ achievement, onClaim }: AchievementCardProps) {
  const progress = Math.min((achievement.progress / achievement.requirement) * 100, 100)
  
  const getCategoryIcon = () => {
    switch (achievement.category) {
      case 'learning': return <BookOpen className="h-4 w-4" />
      case 'streak': return <Flame className="h-4 w-4" />
      case 'mastery': return <Star className="h-4 w-4" />
      case 'special': return <Sparkles className="h-4 w-4" />
    }
  }

  const getCategoryColor = () => {
    switch (achievement.category) {
      case 'learning': return 'from-blue-500 to-cyan-500'
      case 'streak': return 'from-orange-500 to-red-500'
      case 'mastery': return 'from-yellow-500 to-amber-500'
      case 'special': return 'from-purple-500 to-pink-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all",
        achievement.unlocked 
          ? "border-yellow-300 dark:border-yellow-700 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20" 
          : "opacity-80"
      )}>
        {achievement.unlocked && (
          <div className="absolute top-0 right-0 p-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-2xl",
              achievement.unlocked 
                ? `bg-gradient-to-br ${getCategoryColor()} shadow-lg` 
                : "bg-muted"
            )}>
              {achievement.unlocked ? (
                <span>{achievement.icon}</span>
              ) : (
                <Lock className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn(
                  "font-semibold truncate",
                  !achievement.unlocked && "text-muted-foreground"
                )}>
                  {achievement.name}
                </h3>
                <Badge variant="secondary" className="text-xs shrink-0">
                  +{achievement.xpReward} XP
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {achievement.description}
              </p>
              
              {!achievement.unlocked && (
                <div className="space-y-1">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {achievement.progress}/{achievement.requirement}
                  </p>
                </div>
              )}
              
              {achievement.unlocked && achievement.unlockedAt && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Đạt được: {new Date(achievement.unlockedAt).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl',
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={cn(
              "rounded-full flex items-center justify-center cursor-pointer",
              sizeClasses[size],
              achievement.unlocked 
                ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg" 
                : "bg-muted opacity-50"
            )}
          >
            {achievement.unlocked ? (
              <span>{achievement.icon}</span>
            ) : (
              <Lock className={cn(
                "text-muted-foreground",
                size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
              )} />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-semibold">{achievement.name}</p>
            <p className="text-xs text-muted-foreground">{achievement.description}</p>
            {!achievement.unlocked && (
              <p className="text-xs mt-1">{achievement.progress}/{achievement.requirement}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface LevelBadgeProps {
  level: number
  currentXp: number
  xpToNextLevel: number
  showProgress?: boolean
}

export function LevelBadge({ level, currentXp, xpToNextLevel, showProgress = true }: LevelBadgeProps) {
  const progress = (currentXp / xpToNextLevel) * 100

  const getLevelColor = () => {
    if (level >= 50) return 'from-purple-500 to-pink-500'
    if (level >= 30) return 'from-yellow-500 to-amber-500'
    if (level >= 20) return 'from-blue-500 to-cyan-500'
    if (level >= 10) return 'from-green-500 to-emerald-500'
    return 'from-gray-500 to-slate-500'
  }

  const getLevelTitle = () => {
    if (level >= 50) return 'Huyền thoại'
    if (level >= 30) return 'Bậc thầy'
    if (level >= 20) return 'Chuyên gia'
    if (level >= 10) return 'Học giả'
    if (level >= 5) return 'Người học'
    return 'Người mới'
  }

  return (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center",
          `bg-gradient-to-br ${getLevelColor()}`,
          "shadow-lg"
        )}
      >
        <span className="text-white font-bold text-lg">{level}</span>
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        </div>
      </motion.div>
      
      <div className="flex-1">
        <p className="font-semibold">{getLevelTitle()}</p>
        {showProgress && (
          <>
            <Progress value={progress} className="h-2 mt-1" />
            <p className="text-xs text-muted-foreground mt-1">
              {currentXp}/{xpToNextLevel} XP đến level {level + 1}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

interface DailyGoalWidgetProps {
  cardsTarget: number
  cardsCompleted: number
  xpTarget: number
  xpEarned: number
  completed: boolean
}

export function DailyGoalWidget({ 
  cardsTarget, 
  cardsCompleted, 
  xpTarget, 
  xpEarned, 
  completed 
}: DailyGoalWidgetProps) {
  const cardsProgress = Math.min((cardsCompleted / cardsTarget) * 100, 100)
  const xpProgress = Math.min((xpEarned / xpTarget) * 100, 100)

  return (
    <Card className={cn(
      "overflow-hidden transition-all",
      completed && "border-green-300 dark:border-green-700"
    )}>
      {completed && (
        <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
      )}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Mục tiêu hôm nay
          </h3>
          {completed && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Hoàn thành!
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {/* Cards Goal */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Thẻ học</span>
              <span className="font-medium">{cardsCompleted}/{cardsTarget}</span>
            </div>
            <Progress value={cardsProgress} className="h-2" />
          </div>

          {/* XP Goal */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Điểm XP</span>
              <span className="font-medium">{xpEarned}/{xpTarget}</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface XpPopupProps {
  amount: number
  reason?: string
  show: boolean
  onComplete?: () => void
}

export function XpPopup({ amount, reason, show, onComplete }: XpPopupProps) {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      onAnimationComplete={onComplete}
      className="fixed top-20 right-4 z-50 pointer-events-none"
    >
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <Zap className="h-5 w-5" />
        <span className="font-bold">+{amount} XP</span>
        {reason && <span className="text-sm opacity-80">• {reason}</span>}
      </div>
    </motion.div>
  )
}

interface StreakCalendarProps {
  weeklyStreak: boolean[]
}

export function StreakCalendar({ weeklyStreak }: StreakCalendarProps) {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const today = new Date().getDay()

  return (
    <div className="flex gap-2 justify-center">
      {days.map((day, index) => (
        <div key={day} className="flex flex-col items-center gap-1">
          <span className="text-xs text-muted-foreground">{day}</span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              weeklyStreak[index] 
                ? "bg-gradient-to-br from-orange-400 to-red-500" 
                : index === today 
                  ? "border-2 border-dashed border-primary"
                  : "bg-muted",
            )}
          >
            {weeklyStreak[index] && (
              <Flame className="h-4 w-4 text-white" />
            )}
          </motion.div>
        </div>
      ))}
    </div>
  )
}
