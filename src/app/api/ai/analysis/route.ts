import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { generateAIResponse } from '../../../../lib/ai/openai';
import { createManagementStyleAnalysisPrompt } from '../../../../lib/ai/prompts';

// POST /api/ai/analysis - メンバーの1on1セッションに基づくマネジメントスタイル分析
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { memberId, startDate, endDate } = data;

    if (!memberId) {
      return NextResponse.json(
        { error: 'メンバーIDが指定されていません' },
        { status: 400 }
      );
    }

    // メンバー情報を取得
    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return NextResponse.json(
        { error: '指定されたメンバーが見つかりません' },
        { status: 404 }
      );
    }

    // 日付範囲のフィルタリングを構築
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    // メンバーの1on1セッションを取得
    const oneOnOnes = await prisma.oneOnOne.findMany({
      where: {
        memberId: memberId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
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

    // マネジメントスタイル分析用のプロンプトを生成
    const prompt = createManagementStyleAnalysisPrompt(oneOnOnes, member);

    // OpenAI APIを使用して分析を生成
    const aiResponse = await generateAIResponse(prompt, {
      maxTokens: 1500,
      temperature: 0.7,
    });

    return NextResponse.json({
      analysis: aiResponse,
      member: member,
      sessionsCount: oneOnOnes.length,
    });
  } catch (error) {
    console.error('マネジメントスタイル分析エラー:', error);
    
    // エラーメッセージの詳細を取得
    const errorMessage = error instanceof Error 
      ? error.message
      : 'マネジメントスタイル分析に失敗しました';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 