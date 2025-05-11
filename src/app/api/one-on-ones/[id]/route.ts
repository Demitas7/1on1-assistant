import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const oneOnOne = await prisma.oneOnOne.findUnique({
      where: { id },
      include: { member: true },
    })

    if (!oneOnOne) {
      return NextResponse.json(
        { error: '1on1記録が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json(oneOnOne)
  } catch (error) {
    console.error('Failed to fetch one-on-one:', error)
    return NextResponse.json(
      { error: '1on1記録の取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const data = await request.json()

    const oneOnOne = await prisma.oneOnOne.update({
      where: { id },
      data: {
        date: new Date(data.date),
        content: data.content,
        nextActions: data.nextActions || null,
      },
      include: { member: true },
    })

    return NextResponse.json(oneOnOne)
  } catch (error) {
    console.error('Failed to update one-on-one:', error)
    return NextResponse.json(
      { error: '1on1記録の更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.oneOnOne.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete one-on-one:', error)
    return NextResponse.json(
      { error: '1on1記録の削除に失敗しました' },
      { status: 500 }
    )
  }
} 