import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { generateAIResponse } from '../../../../lib/ai/openai';
import { createOverallManagementStyleAnalysisPrompt } from '../../../../lib/ai/prompts';

// POST /api/ai/overall-analysis - 全メンバーの1on1セッションに基づく総合的なマネジメントスタイル分析
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { startDate, endDate } = data;

    // 日付範囲のフィルタリングを構築
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // 全メンバーの1on1セッションを取得
    const oneOnOnes = await prisma.oneOnOne.findMany({
      where: {
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      include: {
        member: {
          select: {
            name: true,
            jobTitle: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    if (oneOnOnes.length === 0) {
      return NextResponse.json(
        { error: '分析するための1on1セッションがありません' },
        { status: 404 }
      );
    }

    // 総合的なマネジメントスタイル分析用のプロンプトを生成
    const prompt = createOverallManagementStyleAnalysisPrompt(oneOnOnes);

    // OpenAI APIを使用して分析を生成
    const aiResponse = await generateAIResponse(prompt, {
      maxTokens: 1500,
      temperature: 0.7,
    });

    return NextResponse.json({
      analysis: aiResponse,
      sessionsCount: oneOnOnes.length,
    });
  } catch (error) {
    console.error('総合マネジメントスタイル分析エラー:', error);
    
    // エラーメッセージの詳細を取得
    const errorMessage = error instanceof Error 
      ? error.message
      : '総合マネジメントスタイル分析に失敗しました';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 