import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MemberList } from '@/components/members/member-list'

export const metadata: Metadata = {
  title: 'メンバー一覧 - 1on1アシスタント',
  description: '1on1を実施するメンバーの一覧です。',
}

export default function MembersPage() {
  return (
    <div className="container px-4 py-4 sm:py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">メンバー一覧</h1>
        <Button asChild>
          <Link href="/members/new">新規メンバー作成</Link>
        </Button>
      </div>
      <div className="mt-4 sm:mt-6 md:mt-8">
        <MemberList />
      </div>
    </div>
  )
} 