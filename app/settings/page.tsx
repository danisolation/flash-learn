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
    <main className="container max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Cài đặt</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Giao diện</CardTitle>
            <CardDescription>Tùy chỉnh giao diện ứng dụng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme-toggle">Chế độ tối</Label>
                <p className="text-sm text-muted-foreground">Thay đổi giữa chế độ sáng và tối</p>
              </div>
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4" />
                <Switch
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
                <Moon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="phonetic-toggle">Hiển thị phiên âm</Label>
                <p className="text-sm text-muted-foreground">Hiển thị phiên âm trên thẻ</p>
              </div>
              <Switch id="phonetic-toggle" checked={showPhonetic} onCheckedChange={setShowPhonetic} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Học tập</CardTitle>
            <CardDescription>Tùy chỉnh trải nghiệm học tập</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-flip-toggle">Tự động lật thẻ</Label>
                <p className="text-sm text-muted-foreground">Tự động lật thẻ sau một khoảng thời gian</p>
              </div>
              <Switch id="auto-flip-toggle" checked={autoFlip} onCheckedChange={setAutoFlip} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dữ liệu</CardTitle>
            <CardDescription>Quản lý dữ liệu của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" /> Xuất dữ liệu
              </Button>
              <p className="text-xs text-muted-foreground">Tải xuống tất cả bộ thẻ và dữ liệu học tập của bạn</p>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <input type="file" id="import-file" className="hidden" accept=".json" onChange={handleImportData} />
                <label htmlFor="import-file" className="w-full">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" /> Nhập dữ liệu
                    </span>
                  </Button>
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Nhập dữ liệu từ tệp sao lưu</p>
            </div>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
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
                  <AlertDialogAction onClick={handleClearData}>Xóa tất cả</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
