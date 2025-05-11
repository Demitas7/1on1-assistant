import useSWR, { SWRConfiguration } from 'swr';
import { fetcher } from '../fetchers';

// 基本的なSWRフック設定のデフォルト値
const DEFAULT_SWR_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false, // ページフォーカス時の再検証を無効化
  revalidateIfStale: true,  // 古いデータがある場合は再検証
  revalidateOnReconnect: true, // ネットワーク再接続時の再検証
  dedupingInterval: 2000,   // 2秒間の重複リクエスト防止
  focusThrottleInterval: 5000, // フォーカスイベントを5秒間スロットル
  errorRetryCount: 3,       // エラー時の再試行回数
  errorRetryInterval: 5000, // エラー時の再試行間隔（5秒）
};

// 基本的なSWRフックをラップしたフック
export function useData<T>(key: string | null, config?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    key,
    fetcher,
    {
      ...DEFAULT_SWR_CONFIG,
      ...config
    }
  );

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    mutate
  };
}

// メンバー詳細を取得するフック
export function useMember(id: string | null) {
  return useData(id ? `/api/members/${id}` : null);
}

// メンバー一覧を取得するフック
export function useMembers() {
  return useData('/api/members', { 
    // メンバーリストはあまり頻繁に変更されないのでキャッシュ時間を延長
    dedupingInterval: 10000 
  });
}

// 1on1セッション一覧を取得するフック
export function useOneOnOnes(memberId?: string) {
  const url = memberId 
    ? `/api/one-on-ones?memberId=${memberId}` 
    : '/api/one-on-ones';
  
  return useData(url);
}

// 1on1セッション詳細を取得するフック
export function useOneOnOneDetail(id: string | null) {
  return useData(id ? `/api/one-on-ones/${id}` : null);
}

// AIアドバイスを取得するフック - 長いキャッシュ時間を設定（変更頻度が低いため）
export function useAIAdvice(oneOnOneId: string | null) {
  return useData(
    oneOnOneId ? `/api/ai/advice?oneOnOneId=${oneOnOneId}` : null,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1分間キャッシュを保持
      errorRetryCount: 2,      // APIの負荷を減らすため再試行回数を減らす
    }
  );
}

// 設定を取得するフック
export function useSettings() {
  return useData('/api/settings', {
    // 設定はセッション中に一貫して使用されるべきなので、キャッシュを強化
    dedupingInterval: 30000, // 30秒間のキャッシュ
  });
} 