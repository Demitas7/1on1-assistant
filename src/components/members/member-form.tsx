'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Props {
  id?: string
}

export function MemberForm({ id }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [skills, setSkills] = useState('')
  const [strengths, setStrengths] = useState('')
  const [weaknesses, setWeaknesses] = useState('')
  const [growthPlan, setGrowthPlan] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchMember()
    }
  }, [id])

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/members/${id}`)
      if (!response.ok) {
        throw new Error('メンバーの取得に失敗しました')
      }
      const data = await response.json()
      setName(data.name)
      setJobTitle(data.jobTitle)
      setSkills(data.skills || '')
      setStrengths(data.strengths || '')
      setWeaknesses(data.weaknesses || '')
      setGrowthPlan(data.growthPlan || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(id ? `/api/members/${id}` : '/api/members', {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          jobTitle, 
          skills, 
          strengths, 
          weaknesses, 
          growthPlan 
        }),
      })

      if (!response.ok) {
        throw new Error(id ? 'メンバーの更新に失敗しました' : 'メンバーの作成に失敗しました')
      }

      router.push('/members')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>メンバー情報</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">役職</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">スキル</Label>
            <Textarea
              id="skills"
              value={skills}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSkills(e.target.value)}
              placeholder="保有するスキルや経験を記入してください"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="strengths">得意なこと</Label>
            <Textarea
              id="strengths"
              value={strengths}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStrengths(e.target.value)}
              placeholder="得意なことや強みを記入してください"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weaknesses">不得意なこと</Label>
            <Textarea
              id="weaknesses"
              value={weaknesses}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setWeaknesses(e.target.value)}
              placeholder="不得意なことや改善したい点を記入してください"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="growthPlan">育成プラン</Label>
            <Textarea
              id="growthPlan"
              value={growthPlan}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGrowthPlan(e.target.value)}
              placeholder="このメンバーの育成計画を記入してください"
              className="min-h-[150px]"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 