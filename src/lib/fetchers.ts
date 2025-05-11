/**
 * SWRで使用するフェッチャー関数
 */

// キャッシュの有効時間（秒）
const CACHE_STALE_TIME = 60; // 1分後にキャッシュを古いと判断

// 基本的なフェッチャー
export async function fetcher(url: string, init?: RequestInit) {
  // リクエスト設定のデフォルト値とマージ
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  };

  try {
    const res = await fetch(url, options);
    
    // エラーハンドリング
    if (!res.ok) {
      // レスポンスのJSONパースを試みる
      const errorData = await res.json().catch(() => ({}));
      const error: Error & { status?: number } = new Error(
        errorData.error || `APIリクエストに失敗しました (${res.status})`
      );
      
      // エラーオブジェクトにステータスコードを追加
      error.status = res.status;
      throw error;
    }
    
    return res.json();
  } catch (error) {
    // ネットワークエラーなどの場合
    if (!(error instanceof Error)) {
      throw new Error('不明なエラーが発生しました');
    }
    
    // エラーを再スロー
    throw error;
  }
}

// メンバー取得用フェッチャー
export async function fetchMember(id: string) {
  return fetcher(`/api/members/${id}`);
}

// メンバー一覧取得用フェッチャー - キャッシュ優先
export async function fetchMembers() {
  return fetcher('/api/members', {
    headers: {
      'Cache-Control': `stale-while-revalidate=${CACHE_STALE_TIME}`,
    },
  });
}

// 1on1セッション一覧取得用フェッチャー
export async function fetchOneOnOnes(memberId?: string) {
  const url = memberId ? `/api/one-on-ones?memberId=${memberId}` : '/api/one-on-ones';
  return fetcher(url, {
    headers: {
      'Cache-Control': `stale-while-revalidate=${CACHE_STALE_TIME}`,
    },
  });
}

// 1on1セッション詳細取得用フェッチャー
export async function fetchOneOnOneDetail(id: string) {
  return fetcher(`/api/one-on-ones/${id}`);
}

// AIアドバイス取得用フェッチャー - 長いキャッシュ時間
export async function fetchAIAdvice(oneOnOneId: string) {
  return fetcher(`/api/ai/advice?oneOnOneId=${oneOnOneId}`, {
    headers: {
      'Cache-Control': `stale-while-revalidate=${CACHE_STALE_TIME * 5}`, // 5倍長くキャッシュ
    },
  });
}

// 設定取得用フェッチャー
export async function fetchSettings() {
  return fetcher('/api/settings', {
    headers: {
      'Cache-Control': `stale-while-revalidate=${CACHE_STALE_TIME * 3}`, // 3倍長くキャッシュ
    },
  });
}

// 分析データ取得用フェッチャー
export async function fetchAnalysis(memberId?: string, period?: string) {
  const params = new URLSearchParams();
  if (memberId) params.append('memberId', memberId);
  if (period) params.append('period', period);
  
  const url = `/api/ai/analysis?${params.toString()}`;
  
  return fetcher(url, {
    headers: {
      'Cache-Control': `stale-while-revalidate=${CACHE_STALE_TIME * 5}`, // 5倍長くキャッシュ
    },
  });
} 