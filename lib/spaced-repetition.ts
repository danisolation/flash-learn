// Thuật toán SM-2 (SuperMemo 2) cho Spaced Repetition
// Đây là thuật toán khoa học để tối ưu hóa việc học và ghi nhớ

export interface ReviewCard {
  id: number
  front: string
  back: string
  phonetic?: string
  example?: string
  // SM-2 fields
  easeFactor: number // Hệ số dễ (mặc định 2.5)
  interval: number // Khoảng cách giữa các lần ôn (ngày)
  repetition: number // Số lần ôn tập liên tiếp đúng
  nextReviewDate: string // Ngày ôn tập tiếp theo
  lastReviewDate?: string
  status: 'new' | 'learning' | 'review' | 'mastered'
}

export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5
  // 0: Hoàn toàn không nhớ
  // 1: Sai, nhưng nhớ được sau khi xem đáp án
  // 2: Sai, nhưng dễ nhớ lại
  // 3: Đúng nhưng khó khăn
  // 4: Đúng với một chút do dự
  // 5: Hoàn hảo - nhớ ngay lập tức
}

// SM-2 Algorithm Implementation
export function calculateNextReview(
  card: ReviewCard,
  quality: ReviewResult['quality']
): Partial<ReviewCard> {
  let { easeFactor, interval, repetition } = card

  // Cập nhật ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEaseFactor = Math.max(
    1.3, // Minimum EF
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  )

  let newInterval: number
  let newRepetition: number
  let newStatus: ReviewCard['status']

  if (quality < 3) {
    // Nếu trả lời sai hoặc khó khăn, reset về đầu
    newRepetition = 0
    newInterval = 1
    newStatus = 'learning'
  } else {
    // Trả lời đúng
    newRepetition = repetition + 1

    if (repetition === 0) {
      newInterval = 1
    } else if (repetition === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(interval * newEaseFactor)
    }

    // Xác định status dựa trên interval
    if (newInterval >= 21) {
      newStatus = 'mastered'
    } else if (newInterval >= 7) {
      newStatus = 'review'
    } else {
      newStatus = 'learning'
    }
  }

  // Tính ngày ôn tập tiếp theo
  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + newInterval)

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetition: newRepetition,
    nextReviewDate: nextDate.toISOString(),
    lastReviewDate: new Date().toISOString(),
    status: newStatus,
  }
}

// Lấy các thẻ cần ôn tập hôm nay
export function getCardsToReview(cards: ReviewCard[]): ReviewCard[] {
  const now = new Date()
  return cards.filter((card) => {
    if (card.status === 'new') return true
    if (!card.nextReviewDate) return true
    const reviewDate = new Date(card.nextReviewDate)
    return reviewDate <= now
  })
}

// Sắp xếp thẻ theo độ ưu tiên
export function sortByPriority(cards: ReviewCard[]): ReviewCard[] {
  return [...cards].sort((a, b) => {
    // Thẻ mới ưu tiên cao nhất
    if (a.status === 'new' && b.status !== 'new') return -1
    if (b.status === 'new' && a.status !== 'new') return 1

    // Thẻ learning ưu tiên tiếp
    if (a.status === 'learning' && b.status === 'review') return -1
    if (b.status === 'learning' && a.status === 'review') return 1

    // Sắp xếp theo ease factor (thẻ khó hơn trước)
    return a.easeFactor - b.easeFactor
  })
}

// Tính toán thống kê học tập
export function calculateStudyStats(cards: ReviewCard[]) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const stats = {
    total: cards.length,
    new: cards.filter((c) => c.status === 'new').length,
    learning: cards.filter((c) => c.status === 'learning').length,
    review: cards.filter((c) => c.status === 'review').length,
    mastered: cards.filter((c) => c.status === 'mastered').length,
    dueToday: 0,
    reviewedToday: 0,
    averageEaseFactor: 0,
  }

  let totalEF = 0
  let efCount = 0

  cards.forEach((card) => {
    if (card.nextReviewDate) {
      const reviewDate = new Date(card.nextReviewDate)
      if (reviewDate <= now) {
        stats.dueToday++
      }
    } else if (card.status !== 'new') {
      stats.dueToday++
    }

    if (card.lastReviewDate) {
      const lastReview = new Date(card.lastReviewDate)
      if (lastReview >= todayStart) {
        stats.reviewedToday++
      }
    }

    if (card.easeFactor) {
      totalEF += card.easeFactor
      efCount++
    }
  })

  stats.averageEaseFactor = efCount > 0 ? totalEF / efCount : 2.5

  return stats
}

// Chuyển đổi card cũ sang format SM-2
export function migrateToSM2(
  oldCard: any
): ReviewCard {
  const now = new Date().toISOString()
  
  let status: ReviewCard['status'] = 'new'
  let interval = 0
  let repetition = 0
  
  if (oldCard.status === 'known') {
    status = 'mastered'
    interval = 21
    repetition = 5
  } else if (oldCard.status === 'learning') {
    status = 'learning'
    interval = 1
    repetition = 1
  }

  return {
    id: oldCard.id,
    front: oldCard.front,
    back: oldCard.back,
    phonetic: oldCard.phonetic,
    example: oldCard.example,
    easeFactor: 2.5,
    interval,
    repetition,
    nextReviewDate: now,
    lastReviewDate: oldCard.lastReviewed,
    status,
  }
}

// Dự đoán thời gian để master một bộ thẻ
export function predictMasteryTime(cards: ReviewCard[]): number {
  const notMastered = cards.filter((c) => c.status !== 'mastered')
  // Ước tính trung bình 21 ngày cho mỗi thẻ chưa master
  // với điều kiện học đều đặn
  return Math.ceil(notMastered.length * 3) // Trung bình 3 ngày per thẻ
}

// Tính điểm XP dựa trên quality
export function calculateXP(quality: ReviewResult['quality']): number {
  const xpMap: Record<number, number> = {
    0: 1,
    1: 2,
    2: 3,
    3: 5,
    4: 8,
    5: 10,
  }
  return xpMap[quality] || 0
}
