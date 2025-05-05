import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import DeckList from "@/components/deck-list"
import RecentActivity from "@/components/recent-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SearchBar from "@/components/search-bar"
import StatsChart from "@/components/stats-chart"

export default function Home() {
  return (
    <main className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">FlashLearn</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Cài đặt</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      <section className="mb-10">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-none shadow-md overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-200/50 dark:bg-blue-800/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-indigo-200/50 dark:bg-indigo-800/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold">Bắt đầu học ngay</h2>
                <p className="text-muted-foreground max-w-md">
                  Nâng cao vốn từ vựng tiếng Anh của bạn với phương pháp học thẻ thông minh và hiệu quả.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/study">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md">
                      Học ngay <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="outline" className="border-2">
                      <Plus className="mr-2 h-4 w-4" /> Tạo bộ thẻ mới
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center bg-white/80 dark:bg-gray-800/50 p-4 rounded-xl shadow-inner">
                <BookOpen className="h-24 w-24 text-blue-500/80" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          <Tabs defaultValue="decks" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="decks" className="text-sm">
                  Bộ thẻ của bạn
                </TabsTrigger>
                <TabsTrigger value="stats" className="text-sm">
                  Thống kê học tập
                </TabsTrigger>
              </TabsList>
              <Link href="/decks">
                <Button variant="ghost" size="sm">
                  Xem tất cả
                </Button>
              </Link>
            </div>

            <TabsContent value="decks" className="mt-0">
              <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
                <DeckList />
              </Suspense>
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
                <StatsChart />
              </Suspense>
            </TabsContent>
          </Tabs>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-full"></div>
            Hoạt động gần đây
          </h2>
          <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
            <RecentActivity />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
