import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { generateAIResponse } from '../../../../lib/ai/openai';
import { createNextSessionQuestionsPrompt } from '../../../../lib/ai/prompts';

// POST /api/ai/questions - 特定の1on1セッションに基づいて次回の質問リストを生成
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

    // 1on1セッションとメンバー情報を取得
    const oneOnOne = await prisma.oneOnOne.findUnique({
      where: { id: oneOnOneId },
      include: { member: true },
    });

    if (!oneOnOne) {
      return NextResponse.json(
        { error: '指定された1on1セッションが見つかりません' },
        { status: 404 }
      );
    }

    // 質問リスト生成用のプロンプトを作成
    const prompt = createNextSessionQuestionsPrompt(oneOnOne, oneOnOne.member);

    // OpenAI APIを使用して質問リストを生成
    const aiResponse = await generateAIResponse(prompt, {
      maxTokens: 1200,
      temperature: 0.8, // 少し創造性を高めるため温度を上げる
    });

    // 生成された質問リストを返す（データベースには保存しない）
    return NextResponse.json({
      questions: aiResponse,
      oneOnOne: {
        id: oneOnOne.id,
        date: oneOnOne.date,
        content: oneOnOne.content,
      },
      member: {
        id: oneOnOne.member.id,
        name: oneOnOne.member.name,
      },
    });
  } catch (error) {
    console.error('質問リスト生成エラー:', error);
    
    // エラーメッセージの詳細を取得
    const errorMessage = error instanceof Error 
      ? error.message
      : '質問リストの生成に失敗しました';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 