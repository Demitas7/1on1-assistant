import { Metadata } from 'next'
import { MemberForm } from '@/components/members/member-form'

interface Props {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'メンバー編集 - 1on1アシスタント',
  description: 'メンバー情報を編集します。',
}

export default function EditMemberPage({ params }: Props) {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">メンバー編集</h1>
      </div>
      <div className="mt-8">
        <MemberForm id={params.id} />
      </div>
    </div>
  )
} 