"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Moon, Sun, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { useFlashcards } from "@/components/flashcard-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { decks, importData, clearAllData } = useFlashcards()
  const { toast } = useToast()
  const [autoFlip, setAutoFlip] = useState(false)
  const [showPhonetic, setShowPhonetic] = useState(true)

  const handleExportData = () => {
    const dataStr = JSON.stringify({ decks })
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `flashlearn-backup-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Xuất dữ liệu thành công",
      description: "Dữ liệu của bạn đã được xuất thành công.",
    })
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        if (!data.decks || !Array.isArray(data.decks)) {
          throw new Error("Định dạng dữ liệu không hợp lệ")
        }

        importData(data.decks)

        toast({
          title: "Nhập dữ liệu thành công",
          description: `Đã nhập ${data.decks.length} bộ thẻ.`,
        })
      } catch (error) {
        toast({
          title: "Lỗi khi nhập dữ liệu",
          description: "Tệp không hợp lệ hoặc bị hỏng.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    clearAllData()
    toast({
      title: "Đã xóa tất cả dữ liệu",
      description: "Tất cả bộ thẻ và dữ liệu học tập đã được xóa.",
    })
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" className="md:hidden">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Cài đặt</h1>
          <p className="text-muted-foreground text-sm">Tùy chỉnh ứng dụng theo ý bạn</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance Card */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-purple-400 to-pink-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                {theme === "dark" ? <Moon className="h-4 w-4 text-purple-600" /> : <Sun className="h-4 w-4 text-purple-600" />}
              </div>
              Giao diện
            </CardTitle>
            <CardDescription>Tùy chỉnh giao diện ứng dụng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="theme-toggle" className="font-medium">Chế độ tối</Label>
                <p className="text-sm text-muted-foreground">Thay đổi giữa chế độ sáng và tối</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="phonetic-toggle" className="font-medium">Hiển thị phiên âm</Label>
                <p className="text-sm text-muted-foreground">Hiển thị phiên âm trên thẻ</p>
              </div>
              <Switch id="phonetic-toggle" checked={showPhonetic} onCheckedChange={setShowPhonetic} />
            </div>
          </CardContent>
        </Card>

        {/* Learning Card */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-cyan-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Download className="h-4 w-4 text-blue-600" />
              </div>
              Học tập
            </CardTitle>
            <CardDescription>Tùy chỉnh trải nghiệm học tập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="space-y-0.5">
                <Label htmlFor="auto-flip-toggle" className="font-medium">Tự động lật thẻ</Label>
                <p className="text-sm text-muted-foreground">Tự động lật thẻ sau một khoảng thời gian</p>
              </div>
              <Switch id="auto-flip-toggle" checked={autoFlip} onCheckedChange={setAutoFlip} />
            </div>
          </CardContent>
        </Card>

        {/* Data Management Card */}
        <Card className="overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-green-400 to-emerald-500" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Upload className="h-4 w-4 text-green-600" />
              </div>
              Dữ liệu
            </CardTitle>
            <CardDescription>Quản lý dữ liệu của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
              variant="outline" 
              onClick={handleExportData} 
              className="h-auto py-3 flex-col gap-1 hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:hover:bg-green-900/20 transition-all"
            >
                <Download className="h-5 w-5" />
                <span>Xuất dữ liệu</span>
                <span className="text-xs text-muted-foreground font-normal">Tải xuống bản sao lưu</span>
              </Button>
              <div>
                <input type="file" id="import-file" className="hidden" accept=".json" onChange={handleImportData} />
                <label htmlFor="import-file" className="w-full cursor-pointer">
                  <Button 
                    variant="outline" 
                    className="w-full h-auto py-3 flex-col gap-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 transition-all" 
                    asChild
                  >
                    <span>
                      <Upload className="h-5 w-5" />
                      <span>Nhập dữ liệu</span>
                      <span className="text-xs text-muted-foreground font-normal">Khôi phục từ bản sao lưu</span>
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-destructive/5">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" /> Xóa tất cả dữ liệu
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này sẽ xóa vĩnh viễn tất cả bộ thẻ và dữ liệu học tập của bạn. Dữ liệu đã xóa không thể
                    khôi phục.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Xóa tất cả
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

        {/* App Info */}
        <Card className="overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-blue-950/30">
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-3 shadow-lg shadow-blue-500/20">
              <Download className="h-6 w-6 text-white" />
            </div>
            <p className="font-bold text-lg text-foreground mb-1">FlashLearn v3.0</p>
            <p className="text-sm">Ứng dụng học từ vựng tiếng Anh thông minh</p>
            <p className="text-xs mt-1">Spaced Repetition · Gamification · Smart Lookup</p>
            <p className="mt-3 text-xs">Made with ❤️ for learners</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
