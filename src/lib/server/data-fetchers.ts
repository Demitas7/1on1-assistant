import { prisma } from '../prisma';
import { cache } from 'react';

/**
 * メンバー一覧を取得（キャッシュ付き）
 */
export const getMembers = cache(async () => {
  return prisma.member.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
});

/**
 * メンバー詳細を取得（キャッシュ付き）
 */
export const getMember = cache(async (id: string) => {
  const memberId = parseInt(id);
  if (isNaN(memberId)) return null;
  
  return prisma.member.findUnique({
    where: { id: memberId },
  });
});

/**
 * 1on1セッション一覧を取得（キャッシュ付き）
 */
export const getOneOnOnes = cache(async (memberId?: string) => {
  const where = memberId ? { memberId: parseInt(memberId) } : {};
  
  return prisma.oneOnOne.findMany({
    where,
    include: {
      member: true,
    },
    orderBy: {
      date: 'desc',
    },
  });
});

/**
 * 1on1セッション詳細を取得（キャッシュ付き）
 */
export const getOneOnOneDetail = cache(async (id: string) => {
  const oneOnOneId = parseInt(id);
  if (isNaN(oneOnOneId)) return null;
  
  return prisma.oneOnOne.findUnique({
    where: { id: oneOnOneId },
    include: {
      member: true,
    },
  });
});

/**
 * 設定を取得（キャッシュ付き）
 */
export const getSettings = cache(async () => {
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
  
  return settings;
}); 