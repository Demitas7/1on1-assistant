import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    const where = memberId ? { memberId: parseInt(memberId) } : {}

    const oneOnOnes = await prisma.oneOnOne.findMany({
      where,
      include: {
        member: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(oneOnOnes)
  } catch (error) {
    console.error('Failed to fetch one-on-ones:', error)
    return NextResponse.json(
      { error: '1on1記録の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const oneOnOne = await prisma.oneOnOne.create({
      data: {
        memberId: parseInt(data.memberId),
        date: new Date(data.date),
        content: data.content,
        nextActions: data.nextActions || null,
      },
      include: {
        member: true,
      },
    })

    return NextResponse.json(oneOnOne, { status: 201 })
  } catch (error) {
    console.error('Failed to create one-on-one:', error)
    return NextResponse.json(
      { error: '1on1記録の作成に失敗しました' },
      { status: 500 }
    )
  }
} 