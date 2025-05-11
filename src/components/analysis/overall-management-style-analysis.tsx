'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LoaderIcon, SparklesIcon, ArrowLeftIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function OverallManagementStyleAnalysis() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionCount, setSessionCount] = useState(0)

  const analyzeOverallManagementStyle = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/overall-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '総合マネジメントスタイル分析に失敗しました')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      setSessionCount(data.sessionsCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析に失敗しました')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // マークダウンをHTMLに変換する簡易関数
  const renderMarkdown = (content: string) => {
    if (!content) return ''

    // 見出し
    let html = content
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^#### (.*?)$/gm, '<h4 class="text-base font-semibold mt-3 mb-2">$1</h4>')
      
    // リスト
    html = html.replace(/^\* (.*?)$/gm, '<li class="ml-5">$1</li>')
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-5">$1</li>')
    html = html.replace(/^([0-9]+)\. (.*?)$/gm, '<li class="ml-5">$2</li>')
    
    // 連続したリストアイテムをulで囲む
    const regex = /<li class="ml-5">(.*?)<\/li>(\s*<li class="ml-5">.*?<\/li>)*/g
    let match
    while ((match = regex.exec(html)) !== null) {
      const matchedText = match[0]
      const replacement = `<ul class="list-disc my-3">${matchedText}</ul>`
      html = html.replace(matchedText, replacement)
    }
    
    // 段落
    html = html.replace(/^(?!<[hua]|<li|<ul|<ol)(.+)$/gm, '<p class="my-2">$1</p>')
    
    // 改行
    html = html.replace(/\n\n/g, '<br>')
    
    return html
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>総合マネジメントスタイル分析</CardTitle>
            <CardDescription className="mt-2">
              全メンバーとの1on1記録に基づいた総合的なマネジメントスタイルの分析を行います
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              ホームに戻る
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-md p-4 bg-muted/20">
          <h3 className="text-sm font-medium mb-3">分析期間の設定（オプション）</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="startDate">開始日</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate">終了日</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={analyzeOverallManagementStyle}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            >
              {isAnalyzing ? (
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <SparklesIcon className="mr-2 h-4 w-4" />
              )}
              {isAnalyzing ? '分析中...' : '総合マネジメントスタイルを分析する'}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="border rounded-md p-5 bg-white dark:bg-gray-800">
            <div className="mb-3 pb-3 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">分析結果</h3>
              <span className="text-sm text-muted-foreground">分析対象: {sessionCount}件の1on1</span>
            </div>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(analysis) }}
            />
          </div>
        )}

        {!analysis && !isAnalyzing && (
          <div className="text-center py-8 px-4">
            <SparklesIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">総合マネジメントスタイル分析</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              「総合マネジメントスタイルを分析する」ボタンをクリックすると、全メンバーとの1on1記録から
              あなたの総合的なマネジメントスタイルを分析し、改善のヒントを提供します。
            </p>
            <p className="text-sm text-muted-foreground/70">
              分析には数秒から数十秒かかる場合があります
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 