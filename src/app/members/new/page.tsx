import { Metadata } from 'next'
import { MemberForm } from '@/components/members/member-form'

export const metadata: Metadata = {
  title: 'メンバー新規作成 - 1on1アシスタント',
  description: '新しいメンバーを登録します。',
}

export default function NewMemberPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">メンバー新規作成</h1>
      </div>
      <div className="mt-8">
        <MemberForm />
      </div>
    </div>
  )
} 