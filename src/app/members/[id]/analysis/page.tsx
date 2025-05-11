import { Metadata } from 'next'
import { ManagementStyleAnalysis } from '@/components/analysis'

export const metadata: Metadata = {
  title: 'マネジメントスタイル分析 - 1on1アシスタント',
  description: '1on1記録に基づいたマネジメントスタイルの分析を提供します。',
}

interface Props {
  params: {
    id: string
  }
}

export default function AnalysisPage({ params }: Props) {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">マネジメントスタイル分析</h1>
      </div>
      <div className="mt-8">
        <ManagementStyleAnalysis memberId={params.id} />
      </div>
    </div>
  )
} 