import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// クラス名を結合するユーティリティ関数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// パフォーマンス計測用の関数
export function measurePerformance<T>(fn: () => T, label: string): T {
  if (process.env.NODE_ENV === 'development') {
    console.time(label);
    const result = fn();
    console.timeEnd(label);
    return result;
  }
  return fn();
}

// メモリ使用量をログに出力する関数（開発環境のみ）
export function logMemoryUsage(label: string): void {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    if (performance && 'memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`${label} - Memory: ${Math.round(memory.usedJSHeapSize / 1048576)}MB / ${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`);
    }
  }
}

// 非同期処理のパフォーマンス計測
export async function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  if (process.env.NODE_ENV === 'development') {
    console.time(label);
    try {
      const result = await fn();
      console.timeEnd(label);
      return result;
    } catch (error) {
      console.timeEnd(label);
      throw error;
    }
  }
  return fn();
}
