import { Metadata } from 'next'
import { MemberDetail } from '@/components/members/member-detail'

export const metadata: Metadata = {
  title: 'メンバー詳細 - 1on1アシスタント',
  description: 'メンバーの詳細情報を表示します。',
}

interface Props {
  params: {
    id: string
  }
}

export default function MemberDetailPage({ params }: Props) {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">メンバー詳細</h1>
      </div>
      <div className="mt-8">
        <MemberDetail id={params.id} />
      </div>
    </div>
  )
} 