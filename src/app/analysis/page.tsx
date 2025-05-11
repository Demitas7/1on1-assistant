import { Metadata } from 'next'
import { OverallManagementStyleAnalysis } from '@/components/analysis/overall-management-style-analysis'

export const metadata: Metadata = {
  title: 'マネジメントスタイル分析 - 1on1アシスタント',
  description: '全メンバーとの1on1記録に基づいたマネジメントスタイルの総合分析を提供します。',
}

export default function OverallAnalysisPage() {
  return (
    <div className="container px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">総合マネジメントスタイル分析</h1>
      </div>
      <div className="mt-4 sm:mt-6 md:mt-8">
        <OverallManagementStyleAnalysis />
      </div>
    </div>
  )
} 