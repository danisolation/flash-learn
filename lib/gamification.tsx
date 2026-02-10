"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'learning' | 'streak' | 'mastery' | 'special'
  requirement: number
  progress: number
  unlocked: boolean
  unlockedAt?: string
  xpReward: number
}

export interface DailyGoal {
  cardsToReview: number
  cardsReviewed: number
  xpTarget: number
  xpEarned: number
  completed: boolean
  date: string
}

export interface GamificationState {
  level: number
  currentXp: number
  totalXp: number
  xpToNextLevel: number
  achievements: Achievement[]
  dailyGoal: DailyGoal
  weeklyStreak: boolean[]
  longestStreak: number
  currentStreak: number
}

interface GamificationContextType {
  state: GamificationState
  addXp: (amount: number, reason?: string) => void
  checkAchievements: () => void
  updateDailyGoal: (cardsReviewed: number, xpEarned: number) => void
  setDailyGoalTarget: (cards: number, xp: number) => void
  getUnlockedAchievements: () => Achievement[]
  getLockedAchievements: () => Achievement[]
}

const defaultAchievements: Achievement[] = [
  // Learning achievements
  {
    id: 'first_card',
    name: 'Bước đầu tiên',
    description: 'Học thẻ đầu tiên',
    icon: '🎯',
    category: 'learning',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xpReward: 10,
  },
  {
    id: 'ten_cards',
    name: 'Người học chăm chỉ',
    description: 'Học 10 thẻ',
    icon: '📚',
    category: 'learning',
    requirement: 10,
    progress: 0,
    unlocked: false,
    xpReward: 50,
  },
  {
    id: 'fifty_cards',
    name: 'Học giả',
    description: 'Học 50 thẻ',
    icon: '🎓',
    category: 'learning',
    requirement: 50,
    progress: 0,
    unlocked: false,
    xpReward: 100,
  },
  {
    id: 'hundred_cards',
    name: 'Bậc thầy',
    description: 'Học 100 thẻ',
    icon: '👑',
    category: 'learning',
    requirement: 100,
    progress: 0,
    unlocked: false,
    xpReward: 200,
  },
  {
    id: 'five_hundred_cards',
    name: 'Huyền thoại',
    description: 'Học 500 thẻ',
    icon: '🏆',
    category: 'learning',
    requirement: 500,
    progress: 0,
    unlocked: false,
    xpReward: 500,
  },
  // Streak achievements
  {
    id: 'three_day_streak',
    name: 'Khởi động',
    description: 'Duy trì chuỗi 3 ngày',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    progress: 0,
    unlocked: false,
    xpReward: 30,
  },
  {
    id: 'seven_day_streak',
    name: 'Tuần lễ hoàn hảo',
    description: 'Duy trì chuỗi 7 ngày',
    icon: '⚡',
    category: 'streak',
    requirement: 7,
    progress: 0,
    unlocked: false,
    xpReward: 70,
  },
  {
    id: 'thirty_day_streak',
    name: 'Chiến binh',
    description: 'Duy trì chuỗi 30 ngày',
    icon: '💪',
    category: 'streak',
    requirement: 30,
    progress: 0,
    unlocked: false,
    xpReward: 300,
  },
  {
    id: 'hundred_day_streak',
    name: 'Bất khả chiến bại',
    description: 'Duy trì chuỗi 100 ngày',
    icon: '🌟',
    category: 'streak',
    requirement: 100,
    progress: 0,
    unlocked: false,
    xpReward: 1000,
  },
  // Mastery achievements
  {
    id: 'first_mastery',
    name: 'Thuộc lòng',
    description: 'Master thẻ đầu tiên',
    icon: '✨',
    category: 'mastery',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xpReward: 20,
  },
  {
    id: 'ten_mastery',
    name: 'Nhà ngôn ngữ',
    description: 'Master 10 thẻ',
    icon: '💎',
    category: 'mastery',
    requirement: 10,
    progress: 0,
    unlocked: false,
    xpReward: 100,
  },
  {
    id: 'deck_mastery',
    name: 'Hoàn thành bộ thẻ',
    description: 'Master toàn bộ một bộ thẻ',
    icon: '🎖️',
    category: 'mastery',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xpReward: 150,
  },
  // Special achievements
  {
    id: 'night_owl',
    name: 'Cú đêm',
    description: 'Học sau 11 giờ đêm',
    icon: '🦉',
    category: 'special',
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
    category: 'special',
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
    category: 'special',
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
    category: 'special',
    requirement: 1,
    progress: 0,
    unlocked: false,
    xpReward: 75,
  },
  {
    id: 'game_master',
    name: 'Game Master',
    description: 'Hoàn thành tất cả các trò chơi',
    icon: '🎮',
    category: 'special',
    requirement: 2,
    progress: 0,
    unlocked: false,
    xpReward: 100,
  },
]

// XP required for each level (exponential growth)
function getXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

function calculateLevel(totalXp: number): { level: number; currentXp: number; xpToNextLevel: number } {
  let level = 1
  let xpRemaining = totalXp

  while (xpRemaining >= getXpForLevel(level)) {
    xpRemaining -= getXpForLevel(level)
    level++
  }

  return {
    level,
    currentXp: xpRemaining,
    xpToNextLevel: getXpForLevel(level),
  }
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationState>(() => {
    const today = new Date().toDateString()
    return {
      level: 1,
      currentXp: 0,
      totalXp: 0,
      xpToNextLevel: 100,
      achievements: defaultAchievements,
      dailyGoal: {
        cardsToReview: 20,
        cardsReviewed: 0,
        xpTarget: 50,
        xpEarned: 0,
        completed: false,
        date: today,
      },
      weeklyStreak: [false, false, false, false, false, false, false],
      longestStreak: 0,
      currentStreak: 0,
    }
  })

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flashlearn-gamification')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Check if daily goal needs reset
        const today = new Date().toDateString()
        if (parsed.dailyGoal?.date !== today) {
          parsed.dailyGoal = {
            ...parsed.dailyGoal,
            cardsReviewed: 0,
            xpEarned: 0,
            completed: false,
            date: today,
          }
        }
        setState(parsed)
      } catch (e) {
        console.error('Error loading gamification state:', e)
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('flashlearn-gamification', JSON.stringify(state))
  }, [state])

  const addXp = (amount: number, reason?: string) => {
    setState((prev) => {
      const newTotalXp = prev.totalXp + amount
      const { level, currentXp, xpToNextLevel } = calculateLevel(newTotalXp)

      const newDailyGoal = {
        ...prev.dailyGoal,
        xpEarned: prev.dailyGoal.xpEarned + amount,
      }

      // Check if daily goal is completed
      if (
        newDailyGoal.cardsReviewed >= newDailyGoal.cardsToReview &&
        newDailyGoal.xpEarned >= newDailyGoal.xpTarget
      ) {
        newDailyGoal.completed = true
      }

      return {
        ...prev,
        level,
        currentXp,
        totalXp: newTotalXp,
        xpToNextLevel,
        dailyGoal: newDailyGoal,
      }
    })
  }

  const updateDailyGoal = (cardsReviewed: number, xpEarned: number) => {
    setState((prev) => {
      const newDailyGoal = {
        ...prev.dailyGoal,
        cardsReviewed: prev.dailyGoal.cardsReviewed + cardsReviewed,
        xpEarned: prev.dailyGoal.xpEarned + xpEarned,
      }

      if (
        newDailyGoal.cardsReviewed >= newDailyGoal.cardsToReview &&
        newDailyGoal.xpEarned >= newDailyGoal.xpTarget
      ) {
        newDailyGoal.completed = true
      }

      return {
        ...prev,
        dailyGoal: newDailyGoal,
      }
    })
  }

  const setDailyGoalTarget = (cards: number, xp: number) => {
    setState((prev) => ({
      ...prev,
      dailyGoal: {
        ...prev.dailyGoal,
        cardsToReview: cards,
        xpTarget: xp,
      },
    }))
  }

  const checkAchievements = () => {
    // This will be called by other parts of the app
    // to check and unlock achievements based on current stats
  }

  const getUnlockedAchievements = () => {
    return state.achievements.filter((a) => a.unlocked)
  }

  const getLockedAchievements = () => {
    return state.achievements.filter((a) => !a.unlocked)
  }

  return (
    <GamificationContext.Provider
      value={{
        state,
        addXp,
        checkAchievements,
        updateDailyGoal,
        setDailyGoalTarget,
        getUnlockedAchievements,
        getLockedAchievements,
      }}
    >
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider')
  }
  return context
}
