'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Member {
  id: string
  name: string
  jobTitle: string
  createdAt: string
}

interface MemberListClientProps {
  initialMembers: Member[]
}

export function MemberListClient({ initialMembers }: MemberListClientProps) {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('このメンバーを削除してもよろしいですか？')) {
      return
    }

    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('メンバーの削除に失敗しました')
      }

      setMembers(members.filter((member) => member.id !== id))
      router.refresh() // ページデータを再検証
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (members.length === 0) {
    return (
      <Card className="animate-in">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">メンバーが登録されていません</CardTitle>
          <CardDescription className="text-sm">
            「新規メンバー作成」ボタンからメンバーを登録してください。
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member, index) => (
        <Card 
          key={member.id} 
          className="flex flex-col animate-in transition-all duration-300 hover:shadow-lg dark:shadow-gray-900/20"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">{member.name}</CardTitle>
            <CardDescription className="text-sm">{member.jobTitle}</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 mt-auto">
            <div className="flex flex-wrap gap-2 justify-end">
              <Button size="sm" variant="outline" asChild className="text-xs sm:text-sm transition-colors duration-200">
                <Link href={`/members/${member.id}`}>詳細</Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="text-xs sm:text-sm transition-colors duration-200">
                <Link href={`/members/${member.id}/edit`}>編集</Link>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(member.id)}
                className="text-xs sm:text-sm transition-colors duration-200"
              >
                削除
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 