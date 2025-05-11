'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

interface Member {
  id: number
  name: string
}

interface OneOnOneData {
  date: string
  content: string
  nextActions: string
}

interface Props {
  memberId: string
  oneOnOneId?: string
}

export function OneOnOneForm({ memberId, oneOnOneId }: Props) {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState<OneOnOneData>({
    date: new Date().toISOString().split('T')[0], // 今日の日付をデフォルト値に
    content: '',
    nextActions: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = !!oneOnOneId

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // メンバー情報の取得
        const memberResponse = await fetch(`/api/members/${memberId}`)
        if (!memberResponse.ok) {
          throw new Error('メンバー情報の取得に失敗しました')
        }
        const memberData = await memberResponse.json()
        setMember(memberData)

        // 編集モードの場合は既存の1on1データを取得
        if (isEditMode) {
          const oneOnOneResponse = await fetch(`/api/one-on-ones/${oneOnOneId}`)
          if (!oneOnOneResponse.ok) {
            throw new Error('1on1データの取得に失敗しました')
          }
          const oneOnOneData = await oneOnOneResponse.json()
          
          setFormData({
            date: new Date(oneOnOneData.date).toISOString().split('T')[0],
            content: oneOnOneData.content,
            nextActions: oneOnOneData.nextActions || '',
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [memberId, oneOnOneId, isEditMode])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditMode 
        ? `/api/one-on-ones/${oneOnOneId}`
        : '/api/one-on-ones'
      
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          memberId,
        }),
      })

      if (!response.ok) {
        throw new Error('1on1セッションの保存に失敗しました')
      }

      // メンバー詳細ページにリダイレクト
      router.push(`/members/${memberId}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (error && !member) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium">
              {member?.name} さんとの1on1
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">日付</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">会話内容</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="1on1で話し合った内容を記録してください"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextActions">次のアクション</Label>
            <Textarea
              id="nextActions"
              name="nextActions"
              placeholder="次回までに行うアクションや課題があれば記入してください"
              value={formData.nextActions}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            asChild
          >
            <Link href={`/members/${memberId}`}>キャンセル</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? '保存中...'
              : isEditMode
              ? '更新する'
              : '保存する'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
} 