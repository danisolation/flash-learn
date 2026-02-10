import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Plus, Flame, Target, Zap, Trophy, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DeckList from "@/components/deck-list"
import RecentActivity from "@/components/recent-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SearchBar from "@/components/search-bar"
import StatsChart from "@/components/stats-chart"
import LearningStats from "@/components/learning-stats"

export default function Home() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Header - Hidden on desktop since we have sidebar */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            FlashLearn
          </h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Hero Section - Redesigned */}
      <section className="mb-8">
        <Card className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 border-none shadow-xl overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute right-1/4 top-1/2 w-20 h-20 bg-yellow-300/20 rounded-full blur-lg animate-float"></div>
          </div>
          
          <CardContent className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>Học thông minh hơn, không phải chăm chỉ hơn</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Bắt đầu học ngay hôm nay
                </h2>
                <p className="text-white/80 max-w-md">
                  Nâng cao vốn từ vựng tiếng Anh của bạn với phương pháp spaced repetition và gamification.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                  <Link href="/study">
                    <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg font-semibold">
                      Học ngay <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button size="lg" className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 font-semibold shadow-lg">
                      <Plus className="mr-2 h-4 w-4" /> Tạo bộ thẻ mới
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="hidden md:grid grid-cols-2 gap-3">
                <Suspense fallback={<div className="h-32 animate-pulse bg-white/10 rounded-xl" />}>
                  <LearningStats variant="compact" />
                </Suspense>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Stats - Mobile Only */}
      <section className="mb-6 md:hidden">
        <Suspense fallback={<div className="h-24 animate-pulse bg-muted rounded-xl" />}>
          <LearningStats variant="mobile" />
        </Suspense>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <section className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="decks" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="decks" className="data-[state=active]:bg-background">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Bộ thẻ của bạn
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-background">
                  <Trophy className="h-4 w-4 mr-2" />
                  Thống kê
                </TabsTrigger>
              </TabsList>
              <Link href="/decks">
                <Button variant="ghost" size="sm" className="text-primary">
                  Xem tất cả
                  <ArrowRight className="ml-1 h-4 w-4" />
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
        </section>

        {/* Right Column - Activity & Tips */}
        <section className="space-y-6">
          {/* Recent Activity */}
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

          {/* Daily Goal Progress */}
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Mục tiêu hôm nay
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Thẻ học</span>
                    <span className="font-medium">12/20</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: '60%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Điểm XP</span>
                    <span className="font-medium">35/50</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Flame className="h-5 w-5 text-orange-500" />
                Mẹo học tập
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-amber-900/80 dark:text-amber-100/80">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Học mỗi ngày để duy trì streak
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Ôn tập các thẻ khó thường xuyên hơn
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Đặt mục tiêu 20 thẻ mỗi ngày
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  Thử chế độ luyện nghe để cải thiện
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
