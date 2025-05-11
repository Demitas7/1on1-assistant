import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/settings - 設定を取得
export async function GET() {
  try {
    // 設定を取得（通常は1レコードのみ）
    let settings = await prisma.settings.findFirst();
    
    // 設定が存在しない場合は作成
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          openaiApiKey: '',
          aiModel: 'gpt-4o',
        }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('設定の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '設定の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// PATCH /api/settings - 設定を更新
export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    
    // 既存の設定を検索
    let settings = await prisma.settings.findFirst();
    
    if (settings) {
      // 既存の設定を更新
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          openaiApiKey: data.openaiApiKey,
          aiModel: data.aiModel,
        },
      });
    } else {
      // 設定が存在しない場合は作成
      settings = await prisma.settings.create({
        data: {
          openaiApiKey: data.openaiApiKey,
          aiModel: data.aiModel || 'gpt-4o',
        }
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('設定の更新に失敗しました:', error);
    return NextResponse.json(
      { error: '設定の更新に失敗しました' },
      { status: 500 }
    );
  }
} 