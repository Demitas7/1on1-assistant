import { Metadata } from 'next'
import { OneOnOneDetail } from '@/components/one-on-ones/one-on-one-detail'

export const metadata: Metadata = {
  title: '1on1セッション詳細 - 1on1アシスタント',
  description: '1on1セッションの詳細情報を表示します。',
}

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function OneOnOneDetailPage({ params }: Props) {
  const { id } = await params;
  
  return (
    <div className="container px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">1on1セッション詳細</h1>
      </div>
      <div className="mt-4 sm:mt-6 md:mt-8">
        <OneOnOneDetail id={id} />
      </div>
    </div>
  )
} 