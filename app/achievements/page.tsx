"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Trophy, Star, Flame, BookOpen, Sparkles, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AchievementCard, LevelBadge, StreakCalendar, DailyGoalWidget } from "@/components/achievements"
import { useFlashcards } from "@/components/flashcard-provider"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Mock achievements data (will be replaced with gamification provider)
const achievements = [
  // Learning achievements
  {
    id: 'first_card',
    name: 'Bước đầu tiên',
    description: 'Học thẻ đầu tiên',
    icon: '🎯',
    category: 'learning' as const,
    requirement: 1,
    progress: 1,
    unlocked: true,
    unlockedAt: '2024-01-15T10:30:00Z',
    xpReward: 10,
  },
  {
    id: 'ten_cards',
    name: 'Người học chăm chỉ',
    description: 'Học 10 thẻ',
    icon: '📚',
    category: 'learning' as const,
    requirement: 10,
    progress: 7,
    unlocked: false,
    xpReward: 50,
  },
  {
    id: 'fifty_cards',
    name: 'Học giả',
    description: 'Học 50 thẻ',
    icon: '🎓',
    category: 'learning' as const,
    requirement: 50,
    progress: 7,
    unlocked: false,
    xpReward: 100,
  },
  {
    id: 'hundred_cards',
    name: 'Bậc thầy',
    description: 'Học 100 thẻ',
    icon: '👑',
    category: 'learning' as const,
    requirement: 100,
    progress: 7,
    unlocked: false,
    xpReward: 200,
  },
  // Streak achievements
  {
    id: 'three_day_streak',
    name: 'Khởi động',
    description: 'Duy trì chuỗi 3 ngày',
    icon: '🔥',
    category: 'streak' as const,
    requirement: 3,
    progress: 2,
    unlocked: false,
    xpReward: 30,
  },
  {
    id: 'seven_day_streak',
    name: 'Tuần lễ hoàn hảo',
    description: 'Duy trì chuỗi 7 ngày',
    icon: '⚡',
    category: 'streak' as const,
    requirement: 7,
    progress: 2,
    unlocked: false,
    xpReward: 70,
  },
  // Mastery achievements
  {
    id: 'first_mastery',
    name: 'Thuộc lòng',
    description: 'Master thẻ đầu tiên',
    icon: '✨',
    category: 'mastery' as const,
    requirement: 1,
    progress: 1,
    unlocked: true,
    unlockedAt: '2024-01-16T14:20:00Z',
    xpReward: 20,
  },
  {
    id: 'ten_mastery',
    name: 'Nhà ngôn ngữ',
    description: 'Master 10 thẻ',
    icon: '💎',
    category: 'mastery' as const,
    requirement: 10,
    progress: 3,
    unlocked: false,
    xpReward: 100,
  },
  // Special achievements
  {
    id: 'night_owl',
    name: 'Cú đêm',
    description: 'Học sau 11 giờ đêm',
    icon: '🦉',
    category: 'special' as const,
    requirement: 1,
    progress: 0,
    unlocked: false,
    xpReward: 25,
  },
  {
    id: 'early_bird',
    name: 'Dậy sớm',
    description: 'Học trước 6 giờ sáng',
    icon: '🐦',
    category: 'special' as const,
    requirement: 1,
    progress: 0,
    unlocked: false,
    xpReward: 25,
  },
  {
    id: 'speed_demon',
    name: 'Tốc độ',
    description: 'Hoàn thành 20 thẻ trong 5 phút',
    icon: '⚡',
    category: 'special' as const,
    requirement: 1,
    progress: 0,
    unlocked: false,
    xpReward: 50,
  },
  {
    id: 'perfect_session',
    name: 'Hoàn hảo',
    description: 'Trả lời đúng 20 thẻ liên tiếp',
    icon: '💯',
    category: 'special' as const,
    requirement: 1,
    progress: 0,
    unlocked: false,
    xpReward: 75,
  },
]

export default function AchievementsPage() {
  const { decks } = useFlashcards()
  const [activeTab, setActiveTab] = useState("all")

  // Calculate stats
  const totalCards = decks.reduce((acc, deck) => acc + deck.cards.length, 0)
  const knownCards = decks.reduce(
    (acc, deck) => acc + deck.cards.filter(c => c.status === 'known').length,
    0
  )

  // Mock data
  const level = 5
  const currentXp = 320
  const xpToNextLevel = 500
  const totalXp = 1820
  const streak = 2
  const weeklyStreak = [true, true, false, false, false, false, false]

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalAchievements = achievements.length

  const getCategoryAchievements = (category: string) => {
    if (category === 'all') return achievements
    return achievements.filter(a => a.category === category)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <main className="container max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Thành tích</h1>
          <p className="text-muted-foreground">
            {unlockedCount}/{totalAchievements} thành tích đã mở khóa
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Level Card */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <LevelBadge
              level={level}
              currentXp={currentXp}
              xpToNextLevel={xpToNextLevel}
            />
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tổng XP</span>
                <span className="font-semibold">{totalXp.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mb-2">
                <Flame className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold">{streak}</p>
              <p className="text-sm text-muted-foreground">ngày liên tiếp</p>
            </div>
            <StreakCalendar weeklyStreak={weeklyStreak} />
          </CardContent>
        </Card>
      </div>

      {/* Daily Goal */}
      <div className="mb-8">
        <DailyGoalWidget
          cardsTarget={20}
          cardsCompleted={12}
          xpTarget={50}
          xpEarned={35}
          completed={false}
        />
      </div>

      {/* Achievement Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 flex-wrap h-auto gap-2">
          <TabsTrigger value="all" className="gap-2">
            <Trophy className="h-4 w-4" />
            Tất cả
            <Badge variant="secondary" className="ml-1">{achievements.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="learning" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Học tập
          </TabsTrigger>
          <TabsTrigger value="streak" className="gap-2">
            <Flame className="h-4 w-4" />
            Chuỗi ngày
          </TabsTrigger>
          <TabsTrigger value="mastery" className="gap-2">
            <Star className="h-4 w-4" />
            Thành thạo
          </TabsTrigger>
          <TabsTrigger value="special" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Đặc biệt
          </TabsTrigger>
        </TabsList>

        {['all', 'learning', 'streak', 'mastery', 'special'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid gap-4"
            >
              {/* Unlocked first */}
              {getCategoryAchievements(tab)
                .sort((a, b) => (a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1))
                .map((achievement) => (
                  <motion.div key={achievement.id} variants={itemVariants}>
                    <AchievementCard achievement={achievement} />
                  </motion.div>
                ))}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Achievement Summary */}
      <Card className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Tổng quan tiến độ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {achievements.filter(a => a.category === 'learning' && a.unlocked).length}/
                {achievements.filter(a => a.category === 'learning').length}
              </p>
              <p className="text-sm text-muted-foreground">Học tập</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {achievements.filter(a => a.category === 'streak' && a.unlocked).length}/
                {achievements.filter(a => a.category === 'streak').length}
              </p>
              <p className="text-sm text-muted-foreground">Chuỗi ngày</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {achievements.filter(a => a.category === 'mastery' && a.unlocked).length}/
                {achievements.filter(a => a.category === 'mastery').length}
              </p>
              <p className="text-sm text-muted-foreground">Thành thạo</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {achievements.filter(a => a.category === 'special' && a.unlocked).length}/
                {achievements.filter(a => a.category === 'special').length}
              </p>
              <p className="text-sm text-muted-foreground">Đặc biệt</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
