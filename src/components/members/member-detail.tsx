'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { CalendarIcon, PlusIcon, SparklesIcon } from 'lucide-react'
import { useMember, useOneOnOnes } from '@/lib/hooks/use-data'
import { Skeleton } from '@/components/ui/skeleton'

interface Member {
  id: string
  name: string
  jobTitle: string
  skills?: string | null
  strengths?: string | null
  weaknesses?: string | null
  growthPlan?: string | null
  createdAt: string
}

interface OneOnOne {
  id: number
  date: string
  content: string
  nextActions: string | null
  createdAt: string
}

interface Props {
  id: string
}

export function MemberDetail({ id }: Props) {
  const router = useRouter()
  const { 
    data: member, 
    isLoading: memberLoading, 
    isError: memberError,
    error: memberErrorDetails
  } = useMember(id) as { 
    data: Member | null, 
    isLoading: boolean, 
    isError: boolean,
    error: Error | null 
  }
  
  const { 
    data: oneOnOnes = [], 
    isLoading: sessionsLoading 
  } = useOneOnOnes(id) as {
    data: OneOnOne[],
    isLoading: boolean
  }

  const isLoading = memberLoading || sessionsLoading

  const handleDelete = async () => {
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

      router.push('/members')
      router.refresh()
    } catch (err) {
      console.error('メンバー削除エラー:', err)
      alert(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  if (memberError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {memberErrorDetails instanceof Error 
            ? memberErrorDetails.message 
            : 'メンバーの取得中にエラーが発生しました'}
        </AlertDescription>
      </Alert>
    )
  }

  if (memberLoading) {
    return <MemberDetailSkeleton />
  }

  if (!member) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>メンバーが見つかりません</CardTitle>
          <CardDescription>
            指定されたメンバーは存在しないか、削除された可能性があります。
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild>
            <Link href="/members">メンバー一覧に戻る</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{member.name}</CardTitle>
          <CardDescription>{member.jobTitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">登録日</dt>
              <dd>{new Date(member.createdAt).toLocaleDateString('ja-JP')}</dd>
            </div>
            
            {member.skills && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">スキル</dt>
                <dd className="mt-1 whitespace-pre-wrap">{member.skills}</dd>
              </div>
            )}
            
            {member.strengths && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">得意なこと</dt>
                <dd className="mt-1 whitespace-pre-wrap">{member.strengths}</dd>
              </div>
            )}
            
            {member.weaknesses && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">不得意なこと</dt>
                <dd className="mt-1 whitespace-pre-wrap">{member.weaknesses}</dd>
              </div>
            )}
            
            {member.growthPlan && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">育成プラン</dt>
                <dd className="mt-1 whitespace-pre-wrap">{member.growthPlan}</dd>
              </div>
            )}
          </dl>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/members">メンバー一覧に戻る</Link>
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              asChild
            >
              <Link href={`/members/${member.id}/analysis`}>
                <SparklesIcon className="w-4 h-4 mr-1" />
                マネジメントスタイル分析
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/members/${member.id}/edit`}>編集</Link>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              削除
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* 1on1セッション一覧 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">1on1セッション履歴</h2>
          <Button asChild>
            <Link href={`/members/${member.id}/one-on-ones/new`}>
              <PlusIcon className="w-4 h-4 mr-2" />
              新規セッション
            </Link>
          </Button>
        </div>

        {sessionsLoading ? (
          <SessionsSkeleton />
        ) : oneOnOnes.length === 0 ? (
          <Card>
            <CardContent className="py-6">
              <p className="text-center text-muted-foreground">
                まだ1on1セッションの記録がありません。
                <br />
                「新規セッション」ボタンから記録を作成してください。
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {oneOnOnes.map((session) => (
              <Card key={session.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {new Date(session.date).toLocaleDateString('ja-JP')}
                    </div>
                    <Link
                      href={`/one-on-ones/${session.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm">
                    {session.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// メンバー詳細のスケルトンローディング
function MemberDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48 mb-1" />
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">登録日</dt>
              <Skeleton className="h-5 w-24 mt-1" />
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">スキル</dt>
              <Skeleton className="h-20 w-full mt-1" />
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">得意なこと</dt>
              <Skeleton className="h-20 w-full mt-1" />
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">不得意なこと</dt>
              <Skeleton className="h-20 w-full mt-1" />
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">育成プラン</dt>
              <Skeleton className="h-20 w-full mt-1" />
            </div>
          </dl>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-44" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
          </div>
        </CardFooter>
      </Card>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">1on1セッション履歴</h2>
          <Skeleton className="h-10 w-40" />
        </div>
        <SessionsSkeleton />
      </div>
    </div>
  )
}

// 1on1セッション一覧のスケルトンローディング
function SessionsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 