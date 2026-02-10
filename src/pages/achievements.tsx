import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Trophy, Star, Flame, BookOpen, Sparkles, Lock, Zap, Target, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AchievementCard, LevelBadge, StreakCalendar, DailyGoalWidget } from "@/components/achievements"
import { useGamification } from "@/lib/gamification"
import { useFlashcards } from "@/components/flashcard-provider"
import { motion } from "framer-motion"

export default function AchievementsPage() {
  const { state } = useGamification()
  const { decks } = useFlashcards()
  const [activeTab, setActiveTab] = useState("all")

  const { achievements, level, currentXp, xpToNextLevel, totalXp, currentStreak, weeklyStreak, dailyGoal } = state

  const totalCards = decks.reduce((acc, deck) => acc + deck.cards.length, 0)
  const knownCards = decks.reduce(
    (acc, deck) => acc + deck.cards.filter(c => c.status === 'known').length,
    0
  )

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
      transition: { staggerChildren: 0.08 }
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
        <Link to="/">
          <Button variant="ghost" size="icon" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Thành tích
          </h1>
          <p className="text-muted-foreground text-sm">
            {unlockedCount}/{totalAchievements} thành tích đã mở khóa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 gap-1">
            <Zap className="h-3.5 w-3.5" />
            {totalXp} XP
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {/* Level Card */}
        <Card className="md:col-span-2 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500" />
          <CardContent className="p-6">
            <LevelBadge
              level={level}
              currentXp={currentXp}
              xpToNextLevel={xpToNextLevel}
            />
            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-primary">{totalXp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Tổng XP</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{knownCards}</p>
                <p className="text-xs text-muted-foreground">Từ đã thuộc</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{unlockedCount}</p>
                <p className="text-xs text-muted-foreground">Thành tích</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500" />
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mb-2 shadow-lg shadow-orange-500/30">
                <Flame className="h-8 w-8 text-white animate-fire" />
              </div>
              <p className="text-3xl font-bold">{currentStreak}</p>
              <p className="text-sm text-muted-foreground">ngày liên tiếp</p>
            </div>
            <StreakCalendar weeklyStreak={weeklyStreak} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Goal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <DailyGoalWidget
          cardsTarget={dailyGoal.cardsToReview}
          cardsCompleted={dailyGoal.cardsReviewed}
          xpTarget={dailyGoal.xpTarget}
          xpEarned={dailyGoal.xpEarned}
          completed={dailyGoal.completed}
        />
      </motion.div>

      {/* Achievement Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start mb-6 flex-wrap h-auto gap-2 bg-muted/50 p-1.5">
          <TabsTrigger value="all" className="gap-2 data-[state=active]:shadow-sm">
            <Trophy className="h-4 w-4" />
            Tất cả
            <Badge variant="secondary" className="ml-1 text-[10px]">{achievements.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="learning" className="gap-2 data-[state=active]:shadow-sm">
            <BookOpen className="h-4 w-4" />
            Học tập
          </TabsTrigger>
          <TabsTrigger value="streak" className="gap-2 data-[state=active]:shadow-sm">
            <Flame className="h-4 w-4" />
            Chuỗi ngày
          </TabsTrigger>
          <TabsTrigger value="mastery" className="gap-2 data-[state=active]:shadow-sm">
            <Star className="h-4 w-4" />
            Thành thạo
          </TabsTrigger>
          <TabsTrigger value="special" className="gap-2 data-[state=active]:shadow-sm">
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
              {getCategoryAchievements(tab)
                .sort((a, b) => (a.unlocked === b.unlocked ? 0 : a.unlocked ? -1 : 1))
                .map((achievement) => (
                  <motion.div key={achievement.id} variants={itemVariants}>
                    <AchievementCard achievement={achievement} />
                  </motion.div>
                ))}
              {getCategoryAchievements(tab).length === 0 && (
                <motion.div variants={itemVariants} className="text-center py-12 text-muted-foreground">
                  <Lock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Chưa có thành tích nào trong mục này</p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Achievement Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400" />
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Tổng quan tiến độ
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { category: 'learning', label: 'Học tập', color: 'text-blue-600 dark:text-blue-400', icon: BookOpen },
                { category: 'streak', label: 'Chuỗi ngày', color: 'text-orange-600 dark:text-orange-400', icon: Flame },
                { category: 'mastery', label: 'Thành thạo', color: 'text-yellow-600 dark:text-yellow-400', icon: Star },
                { category: 'special', label: 'Đặc biệt', color: 'text-purple-600 dark:text-purple-400', icon: Sparkles },
              ].map(({ category, label, color, icon: Icon }) => {
                const catAchievements = achievements.filter(a => a.category === category)
                const unlocked = catAchievements.filter(a => a.unlocked).length
                return (
                  <div key={category} className="text-center p-3 rounded-xl bg-white/50 dark:bg-white/5">
                    <Icon className={`h-5 w-5 mx-auto mb-2 ${color}`} />
                    <p className={`text-2xl font-bold ${color}`}>
                      {unlocked}/{catAchievements.length}
                    </p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
