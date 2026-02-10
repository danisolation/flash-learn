"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Bell, 
  Clock, 
  Flame,
  Calendar,
  CheckCircle2,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyGoalSettingsProps {
  cardsGoal: number
  xpGoal: number
  reminderEnabled: boolean
  reminderTime: string
  onSave: (settings: {
    cardsGoal: number
    xpGoal: number
    reminderEnabled: boolean
    reminderTime: string
  }) => void
}

export function DailyGoalSettings({
  cardsGoal: initialCardsGoal,
  xpGoal: initialXpGoal,
  reminderEnabled: initialReminderEnabled,
  reminderTime: initialReminderTime,
  onSave,
}: DailyGoalSettingsProps) {
  const [cardsGoal, setCardsGoal] = useState(initialCardsGoal)
  const [xpGoal, setXpGoal] = useState(initialXpGoal)
  const [reminderEnabled, setReminderEnabled] = useState(initialReminderEnabled)
  const [reminderTime, setReminderTime] = useState(initialReminderTime)
  const [isOpen, setIsOpen] = useState(false)

  const presetGoals = [
    { cards: 10, xp: 30, label: "Nhẹ nhàng", description: "Phù hợp cho người mới bắt đầu" },
    { cards: 20, xp: 50, label: "Tiêu chuẩn", description: "Mục tiêu hàng ngày phổ biến" },
    { cards: 30, xp: 80, label: "Chuyên cần", description: "Dành cho người học nghiêm túc" },
    { cards: 50, xp: 150, label: "Hardcore", description: "Thử thách bản thân!" },
  ]

  const handleSave = () => {
    onSave({
      cardsGoal,
      xpGoal,
      reminderEnabled,
      reminderTime,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 transition-all"
        >
          <Settings className="h-4 w-4 mr-2" />
          Cài đặt mục tiêu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Cài đặt mục tiêu hàng ngày
          </DialogTitle>
          <DialogDescription>
            Đặt mục tiêu phù hợp với lịch học của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset Goals */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Chọn mục tiêu có sẵn</Label>
            <div className="grid grid-cols-2 gap-2">
              {presetGoals.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setCardsGoal(preset.cards)
                    setXpGoal(preset.xp)
                  }}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    cardsGoal === preset.cards && xpGoal === preset.xp
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/50"
                  )}
                >
                  <div className="font-medium text-sm">{preset.label}</div>
                  <div className="text-xs text-muted-foreground">{preset.cards} thẻ / {preset.xp} XP</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Goal */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Hoặc tùy chỉnh</Label>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Số thẻ mỗi ngày</span>
                <Badge variant="secondary">{cardsGoal} thẻ</Badge>
              </div>
              <Slider
                value={[cardsGoal]}
                onValueChange={([value]) => setCardsGoal(value)}
                min={5}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Điểm XP mỗi ngày</span>
                <Badge variant="secondary">{xpGoal} XP</Badge>
              </div>
              <Slider
                value={[xpGoal]}
                onValueChange={([value]) => setXpGoal(value)}
                min={10}
                max={300}
                step={10}
              />
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="reminder">Nhắc nhở học tập</Label>
              </div>
              <Switch
                id="reminder"
                checked={reminderEnabled}
                onCheckedChange={setReminderEnabled}
              />
            </div>

            {reminderEnabled && (
              <div className="flex items-center gap-4 pl-6">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="time" className="text-sm">Thời gian:</Label>
                <Input
                  id="time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-32"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 transition-all"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            Lưu mục tiêu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DailyGoalTrackerProps {
  cardsTarget: number
  cardsCompleted: number
  xpTarget: number
  xpEarned: number
  streak: number
}

export function DailyGoalTracker({
  cardsTarget,
  cardsCompleted,
  xpTarget,
  xpEarned,
  streak,
}: DailyGoalTrackerProps) {
  const cardsProgress = Math.min((cardsCompleted / cardsTarget) * 100, 100)
  const xpProgress = Math.min((xpEarned / xpTarget) * 100, 100)
  const isGoalComplete = cardsCompleted >= cardsTarget && xpEarned >= xpTarget

  return (
    <Card className={cn(
      "transition-all",
      isGoalComplete && "border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Mục tiêu hôm nay
            {isGoalComplete && (
              <Badge className="bg-green-500 text-white gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Hoàn thành!
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Flame className={cn(
              "h-5 w-5",
              streak > 0 ? "text-orange-500" : "text-muted-foreground"
            )} />
            <span className="text-sm font-medium">{streak}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cards Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Thẻ học</span>
            <span className="font-medium">
              {cardsCompleted}/{cardsTarget}
              {cardsCompleted >= cardsTarget && " ✓"}
            </span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                cardsCompleted >= cardsTarget
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500"
              )}
              style={{ width: `${cardsProgress}%` }}
            />
          </div>
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Điểm XP</span>
            <span className="font-medium">
              {xpEarned}/{xpTarget}
              {xpEarned >= xpTarget && " ✓"}
            </span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                xpEarned >= xpTarget
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-yellow-500 to-amber-500"
              )}
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Motivation Message */}
        {!isGoalComplete && (
          <p className="text-sm text-muted-foreground text-center pt-2">
            {cardsCompleted === 0 
              ? "Bắt đầu học để đạt mục tiêu hôm nay! 💪"
              : cardsProgress >= 50 
                ? "Tuyệt vời! Bạn đã đi được nửa đường rồi! 🔥"
                : "Tiếp tục cố gắng! Bạn có thể làm được! ⭐"
            }
          </p>
        )}

        {isGoalComplete && (
          <div className="text-center pt-2">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              🎉 Xuất sắc! Bạn đã hoàn thành mục tiêu hôm nay!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
