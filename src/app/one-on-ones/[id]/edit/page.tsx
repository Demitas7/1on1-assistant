import { Metadata } from 'next'
import { OneOnOneForm } from '@/components/one-on-ones/one-on-one-form'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: '1on1記録の編集 - 1on1アシスタント',
  description: '1on1記録の内容を編集します。',
}

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function EditOneOnOnePage({ params }: Props) {
  const { id } = await params;
  const oneOnOne = await prisma.oneOnOne.findUnique({
    where: { id: parseInt(id) },
    include: { member: true },
  })

  if (!oneOnOne) {
    notFound()
  }

  return (
    <div className="container px-4 py-4 sm:py-6 md:py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          1on1記録の編集: {oneOnOne.member.name}
        </h1>
      </div>
      <div className="mt-4 sm:mt-6 md:mt-8">
        <OneOnOneForm memberId={oneOnOne.member.id.toString()} oneOnOneId={id} />
      </div>
    </div>
  )
} 