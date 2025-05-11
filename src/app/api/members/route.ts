import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600; // 1時間キャッシュ
export const dynamic = 'force-dynamic'; // キャッシュヘッダーを適切に設定

export async function GET() {
  try {
    const members = await prisma.member.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(members, {
      headers: {
        'Cache-Control': 'max-age=60, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Failed to fetch members:', error)
    return NextResponse.json(
      { error: 'メンバーの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('メンバー作成リクエスト開始');
    const body = await request.json();
    console.log('リクエストボディ:', body);

    const { name, jobTitle, skills, strengths, weaknesses, growthPlan } = body;
    console.log('解析されたデータ:', { name, jobTitle, skills, strengths, weaknesses, growthPlan });

    if (!name || !jobTitle) {
      console.log('バリデーションエラー: 名前または役職が不足しています');
      return NextResponse.json(
        { error: "名前と役職は必須です" },
        { status: 400 }
      );
    }

    console.log('Prismaでメンバー作成を実行...');
    const newMember = await prisma.member.create({
      data: {
        name,
        jobTitle,
        skills,
        strengths,
        weaknesses,
        growthPlan,
      },
    });
    console.log('メンバー作成成功:', newMember);

    return NextResponse.json(newMember, { 
      status: 201,
      headers: {
        // キャッシュの再検証を強制するヘッダー
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error("メンバー作成エラー:", error);
    // エラーの詳細情報をログに出力
    if (error instanceof Error) {
      console.error("エラータイプ:", error.constructor.name);
      console.error("エラーメッセージ:", error.message);
      console.error("スタックトレース:", error.stack);
    }
    return NextResponse.json(
      { error: "メンバーの作成に失敗しました" },
      { status: 500 }
    );
  }
} 