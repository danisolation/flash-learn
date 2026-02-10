import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { FlashcardProvider } from '@/components/flashcard-provider'
import { GamificationProvider } from '@/lib/gamification'
import Sidebar from '@/components/sidebar'
import BottomNav from '@/components/bottom-nav'
import HomePage from '@/pages/home'
import StudyPage from '@/pages/study'
import StudyDeckPage from '@/pages/study-deck'
import CreatePage from '@/pages/create'
import DecksPage from '@/pages/decks'
import GamePage from '@/pages/game'
import AchievementsPage from '@/pages/achievements'
import SettingsPage from '@/pages/settings'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <FlashcardProvider>
        <GamificationProvider>
          <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
            <Sidebar />
            <main className="flex-1 pb-20 md:pb-0 min-h-screen">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/study/:deckId" element={<StudyDeckPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/decks" element={<DecksPage />} />
                <Route path="/game" element={<GamePage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
          <BottomNav />
          <Toaster />
        </GamificationProvider>
      </FlashcardProvider>
    </ThemeProvider>
  )
}
