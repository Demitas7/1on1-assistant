import { PrismaClient, Prisma } from '../generated/prisma'

// PrismaClientのシングルトンインスタンスを作成
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // 開発環境では、グローバル変数にPrismaClientを保存してホットリロード時に複数のインスタンスが作成されるのを防ぐ
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    })
  }

  prisma = globalForPrisma.prisma
}

export { prisma } 