import { Suspense } from 'react'
import { getMembers } from '@/lib/server/data-fetchers'
import { MemberListClient } from './member-list-client'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export async function MemberList() {
  const membersData = await getMembers()
  
  // データをクライアントコンポーネントに適した形に変換
  const members = membersData.map(member => ({
    id: member.id.toString(),
    name: member.name,
    jobTitle: member.jobTitle,
    createdAt: member.createdAt.toISOString(),
  }))
  
  return (
    <Suspense fallback={<MemberListSkeleton />}>
      <MemberListClient initialMembers={members} />
    </Suspense>
  )
}

function MemberListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="pt-2 mt-auto">
            <div className="flex flex-wrap gap-2 justify-end">
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-9 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 