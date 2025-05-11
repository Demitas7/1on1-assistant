import { Metadata } from 'next'
import { OneOnOneForm } from '@/components/one-on-ones/one-on-one-form'

export const metadata: Metadata = {
  title: '新規1on1セッション - 1on1アシスタント',
  description: '新しい1on1セッションを記録します。',
}

interface Props {
  params: {
    id: string
  }
}

export default function NewOneOnOnePage({ params }: Props) {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">新規1on1セッション</h1>
      </div>
      <div className="mt-8">
        <OneOnOneForm memberId={params.id} />
      </div>
    </div>
  )
} 