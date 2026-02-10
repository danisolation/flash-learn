import { Suspense } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, Plus, Flame, Target, Zap, Trophy, Sparkles, Gamepad2, TrendingUp, Brain, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DeckList from "@/components/deck-list"
import RecentActivity from "@/components/recent-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SearchBar from "@/components/search-bar"
import StatsChart from "@/components/stats-chart"
import LearningStats from "@/components/learning-stats"
import { useGamification } from "@/lib/gamification"
import { useFlashcards } from "@/components/flashcard-provider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

function MotionDiv({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const { state } = useGamification()
  const { decks } = useFlashcards()

  const totalCards = decks.reduce((sum, d) => sum + d.cards.length, 0)
  const knownCards = decks.reduce((sum, d) => sum + d.cards.filter(c => c.status === "known").length, 0)
  const cardsProgress = state.dailyGoal.cardsToReview > 0
    ? Math.min((state.dailyGoal.cardsReviewed / state.dailyGoal.cardsToReview) * 100, 100) : 0
  const xpProgress = state.dailyGoal.xpTarget > 0
    ? Math.min((state.dailyGoal.xpEarned / state.dailyGoal.xpTarget) * 100, 100) : 0

  const getLevelTitle = () => {
    if (state.level >= 50) return 'Huyền thoại'
    if (state.level >= 30) return 'Bậc thầy'
    if (state.level >= 20) return 'Chuyên gia'
    if (state.level >= 10) return 'Học giả'
    if (state.level >= 5) return 'Người học'
    return 'Người mới'
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Header - Mobile */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-lg shadow-blue-500/20">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FlashLearn
            </h1>
            <p className="text-xs text-muted-foreground">{getLevelTitle()} · Lv.{state.level}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            <Flame className="h-3.5 w-3.5 animate-fire" />
            <span className="text-xs font-bold">{state.currentStreak}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-bold">{state.totalXp}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <MotionDiv className="mb-6">
        <SearchBar />
      </MotionDiv>

      {/* Hero Section */}
      <MotionDiv className="mb-8" delay={0.1}>
        <Card className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 border-none shadow-2xl shadow-indigo-500/20 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute right-1/4 top-1/2 w-20 h-20 bg-yellow-300/20 rounded-full blur-lg animate-float"></div>
            <div className="absolute left-1/3 top-1/4 w-16 h-16 bg-pink-300/10 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <CardContent className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>Học thông minh hơn với Spaced Repetition</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {state.currentStreak > 0 ? (
                    <>🔥 Chuỗi {state.currentStreak} ngày! Tiếp tục nào!</>
                  ) : (
                    <>Bắt đầu chuỗi học tập hôm nay</>
                  )}
                </h2>
                <p className="text-white/80 max-w-md">
                  {totalCards > 0 
                    ? `Bạn đã thuộc ${knownCards}/${totalCards} từ vựng. ${knownCards < totalCards ? 'Hãy tiếp tục!' : 'Tuyệt vời! 🎉'}`
                    : 'Nâng cao vốn từ vựng tiếng Anh với phương pháp khoa học.'
                  }
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                  <Link to="/study">
                    <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg font-semibold group">
                      Học ngay <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/create">
                    <Button size="lg" className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 font-semibold shadow-lg">
                      <Plus className="mr-2 h-4 w-4" /> Tạo bộ thẻ mới
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="hidden md:grid grid-cols-2 gap-3">
                <Suspense fallback={<div className="h-32 animate-pulse bg-white/10 rounded-xl" />}>
                  <LearningStats variant="compact" />
                </Suspense>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Quick Stats - Mobile */}
      <MotionDiv className="mb-6 md:hidden" delay={0.15}>
        <Suspense fallback={<div className="h-24 animate-pulse bg-muted rounded-xl" />}>
          <LearningStats variant="mobile" />
        </Suspense>
      </MotionDiv>

      {/* Quick Actions */}
      <MotionDiv className="mb-6" delay={0.2}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/study">
            <Card className="card-interactive cursor-pointer group border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Học tập</p>
                  <p className="text-xs text-muted-foreground">{decks.length} bộ thẻ</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/game">
            <Card className="card-interactive cursor-pointer group border-orange-100 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/40 transition-colors">
                  <Gamepad2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Trò chơi</p>
                  <p className="text-xs text-muted-foreground">Học vui</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/achievements">
            <Card className="card-interactive cursor-pointer group border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
                  <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Thành tích</p>
                  <p className="text-xs text-muted-foreground">{state.achievements.filter(a => a.unlocked).length} mở</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link to="/create">
            <Card className="card-interactive cursor-pointer group border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                  <Plus className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Tạo mới</p>
                  <p className="text-xs text-muted-foreground">Bộ thẻ</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </MotionDiv>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <section className="lg:col-span-2 space-y-6">
          <MotionDiv delay={0.25}>
            <Tabs defaultValue="decks" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList className="bg-muted/50 p-1">
                  <TabsTrigger value="decks" className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
                    <BookOpen className="h-4 w-4" />
                    Bộ thẻ của bạn
                  </TabsTrigger>
                  <TabsTrigger value="stats" className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Thống kê
                  </TabsTrigger>
                </TabsList>
                <Link to="/decks">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 group">
                    Xem tất cả
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <TabsContent value="decks" className="mt-0">
                <Suspense fallback={
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map(i => (
                      <div key={i} className="h-52 rounded-xl bg-muted animate-pulse" />
                    ))}
                  </div>
                }>
                  <DeckList />
                </Suspense>
              </TabsContent>
              <TabsContent value="stats" className="mt-0">
                <Suspense fallback={<div className="h-64 rounded-xl bg-muted animate-pulse" />}>
                  <StatsChart />
                </Suspense>
              </TabsContent>
            </Tabs>
          </MotionDiv>
        </section>

        {/* Right Column */}
        <section className="space-y-6">
          <MotionDiv delay={0.3}>
            <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-indigo-500/5">
              <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Mục tiêu hôm nay
                  {state.dailyGoal.completed && (
                    <Badge className="bg-green-500 text-white text-xs animate-bounce-in">✓ Hoàn thành!</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> Thẻ học
                      </span>
                      <span className="font-semibold">{state.dailyGoal.cardsReviewed}/{state.dailyGoal.cardsToReview}</span>
                    </div>
                    <Progress value={cardsProgress} className="h-2.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5" /> Điểm XP
                      </span>
                      <span className="font-semibold">{state.dailyGoal.xpEarned}/{state.dailyGoal.xpTarget}</span>
                    </div>
                    <Progress value={xpProgress} className="h-2.5" />
                  </div>
                  <div className="pt-3 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        {state.level}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{getLevelTitle()}</p>
                        <p className="text-[10px] text-muted-foreground">{state.currentXp}/{state.xpToNextLevel} XP</p>
                      </div>
                    </div>
                    <Link to="/achievements">
                      <Button variant="ghost" size="sm" className="text-xs h-7">
                        Chi tiết <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionDiv>

          <MotionDiv delay={0.35}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
                  <RecentActivity />
                </Suspense>
              </CardContent>
            </Card>
          </MotionDiv>

          <MotionDiv delay={0.4}>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Mẹo học tập
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-amber-900/80 dark:text-amber-100/80">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <Flame className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    Học mỗi ngày để duy trì streak và nhận thêm XP
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    Ôn tập các thẻ khó thường xuyên hơn
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    Đặt mục tiêu 20 thẻ mỗi ngày
                  </li>
                  <li className="flex items-start gap-2">
                    <Gamepad2 className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    Thử các trò chơi để học vui hơn
                  </li>
                </ul>
              </CardContent>
            </Card>
          </MotionDiv>
        </section>
      </div>
    </div>
  )
}
