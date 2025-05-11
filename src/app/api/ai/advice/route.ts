import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { generateAIResponse } from '../../../../lib/ai/openai';
import { createCoachingAdvicePrompt } from '../../../../lib/ai/prompts';

// レスポンスのキャッシュ時間（秒）
const CACHE_MAX_AGE = 60 * 30; // 30分

// POST /api/ai/advice - 特定の1on1セッションに対してAIアドバイスを生成
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { oneOnOneId } = data;

    if (!oneOnOneId) {
      return NextResponse.json(
        { error: '1on1セッションIDが指定されていません' },
        { status: 400 }
      );
    }

    // 1on1セッションを取得
    const oneOnOne = await prisma.oneOnOne.findUnique({
      where: { id: oneOnOneId },
      include: { member: true }, // メンバー情報も取得
    });

    if (!oneOnOne) {
      return NextResponse.json(
        { error: '指定された1on1セッションが見つかりません' },
        { status: 404 }
      );
    }

    // AIアドバイス用のプロンプトを生成
    const prompt = createCoachingAdvicePrompt(oneOnOne, oneOnOne.member);

    // OpenAI APIを使用してアドバイスを生成
    const aiResponse = await generateAIResponse(prompt);

    // 生成されたアドバイスをデータベースに保存
    const updatedOneOnOne = await prisma.oneOnOne.update({
      where: { id: oneOnOneId },
      data: {
        aiSummary: aiResponse,
      },
    });

    // レスポンスにキャッシュヘッダーを設定
    return NextResponse.json(
      {
        advice: aiResponse,
        oneOnOne: updatedOneOnOne,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_MAX_AGE * 2}`,
        },
      }
    );
  } catch (error) {
    console.error('AIアドバイス生成エラー:', error);
    
    // エラーメッセージの詳細を取得
    const errorMessage = error instanceof Error 
      ? error.message
      : 'AIアドバイスの生成に失敗しました';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET /api/ai/advice?oneOnOneId=123 - 保存済みのAIアドバイスを取得
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const oneOnOneId = url.searchParams.get('oneOnOneId');

    if (!oneOnOneId) {
      return NextResponse.json(
        { error: '1on1セッションIDが指定されていません' },
        { status: 400 }
      );
    }

    // 1on1セッションを取得
    const oneOnOne = await prisma.oneOnOne.findUnique({
      where: { id: parseInt(oneOnOneId) },
    });

    if (!oneOnOne) {
      return NextResponse.json(
        { error: '指定された1on1セッションが見つかりません' },
        { status: 404 }
      );
    }

    // AIアドバイスがない場合
    if (!oneOnOne.aiSummary) {
      return NextResponse.json(
        { message: 'このセッションにはまだAIアドバイスがありません' },
        { status: 404 }
      );
    }

    // AIアドバイスは変更頻度が低いためキャッシュを長めに設定
    return NextResponse.json(
      {
        advice: oneOnOne.aiSummary,
        oneOnOne: oneOnOne,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_MAX_AGE * 2}`,
        },
      }
    );
  } catch (error) {
    console.error('AIアドバイス取得エラー:', error);
    return NextResponse.json(
      { error: 'AIアドバイスの取得に失敗しました' },
      { status: 500 }
    );
  }
} 