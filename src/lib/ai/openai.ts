import OpenAI from 'openai';
import { prisma } from '../prisma';
import { LRUCache } from 'lru-cache';

// OpenAIクライアントの初期化とキャッシュ
let openaiClient: OpenAI | null = null;
let cachedApiKey: string | null = null;

// モックモードの設定 (テスト・開発用)
// 本番環境ではfalseに設定する
const USE_MOCK_MODE = false;

// レスポンスキャッシュの設定
// プロンプトをキーとして、レスポンスをキャッシュする
const responseCache = new LRUCache<string, string>({
  max: 100, // 最大キャッシュ数
  ttl: 1000 * 60 * 60 * 24, // キャッシュの有効期間 (24時間)
  maxSize: 5 * 1024 * 1024, // 最大5MBまでキャッシュ
  sizeCalculation: (value: string) => Buffer.byteLength(value), // キャッシュサイズの計算方法
});

// 利用可能なモデルとフォールバック設定
const AVAILABLE_MODELS = {
  DEFAULT: 'gpt-3.5-turbo-0125',
  FALLBACKS: {
    'gpt-4o': 'gpt-4o-2024-05-13',
    'gpt-4o-2024-05-13': 'gpt-4-turbo-2024-04-09',
    'gpt-4-turbo': 'gpt-4-turbo-2024-04-09',
    'gpt-4-turbo-2024-04-09': 'gpt-3.5-turbo-0125',
    'gpt-3.5-turbo': 'gpt-3.5-turbo-0125',
  } as Record<string, string>
};

/**
 * 設定からOpenAI APIキーとモデル情報を取得
 */
export async function getOpenAIConfig() {
  const settings = await prisma.settings.findFirst();
  
  if (!settings || !settings.openaiApiKey) {
    if (USE_MOCK_MODE) {
      return { 
        apiKey: 'mock-api-key', 
        model: AVAILABLE_MODELS.DEFAULT 
      };
    }
    throw new Error('OpenAI APIキーが設定されていません。');
  }
  
  return {
    apiKey: settings.openaiApiKey,
    model: settings.aiModel || AVAILABLE_MODELS.DEFAULT,
  };
}

/**
 * OpenAIクライアントを取得または初期化
 */
export async function getOpenAIClient(): Promise<OpenAI> {
  try {
    const { apiKey } = await getOpenAIConfig();
    
    // APIキーが変更された場合、またはクライアントが初期化されていない場合は新しいクライアントを作成
    if (!openaiClient || cachedApiKey !== apiKey) {
      openaiClient = new OpenAI({
        apiKey: apiKey,
      });
      cachedApiKey = apiKey;
    }
    
    return openaiClient;
  } catch (error) {
    console.error('OpenAIクライアントの初期化に失敗しました:', error);
    throw error;
  }
}

/**
 * モデル名のフォールバック処理
 * 指定されたモデルが利用できない場合、代替モデルを返す
 */
function getFallbackModel(model: string): string {
  return AVAILABLE_MODELS.FALLBACKS[model] || AVAILABLE_MODELS.DEFAULT;
}

/**
 * プロンプトのキャッシュキーを生成
 * モデルとオプションも考慮する
 */
function generateCacheKey(prompt: string, model: string, options?: { maxTokens?: number; temperature?: number }): string {
  return `${model}:${options?.temperature || 0.7}:${options?.maxTokens || 1000}:${prompt}`;
}

/**
 * AI応答を生成
 * キャッシュを活用して同じプロンプトに対する重複呼び出しを防止
 */
export async function generateAIResponse(
  prompt: string,
  options?: {
    maxTokens?: number;
    temperature?: number;
    useCache?: boolean; // キャッシュを使用するかどうか
  }
) {
  const MAX_ATTEMPTS = 3;
  const useCache = options?.useCache !== false; // デフォルトはキャッシュを使用
  
  try {
    // モックモードの場合はモック応答を返す
    if (USE_MOCK_MODE) {
      return "これはモックモードでの応答です。OpenAI APIは使用されていません。";
    }
    
    const { model: configuredModel } = await getOpenAIConfig();
    let currentModel = configuredModel;
    
    // キャッシュキーを生成
    const cacheKey = generateCacheKey(prompt, currentModel, options);
    
    // キャッシュにヒットした場合はキャッシュから応答を返す
    if (useCache && responseCache.has(cacheKey)) {
      console.log('キャッシュヒット: AIレスポンスをキャッシュから取得しました');
      return responseCache.get(cacheKey);
    }
    
    // OpenAIクライアントを取得
    const client = await getOpenAIClient();
    let attempts = 0;
    
    while (attempts < MAX_ATTEMPTS) {
      try {
        const response = await client.chat.completions.create({
          model: currentModel,
          messages: [
            { role: 'system', content: 'マネジメントとコーチングの専門家として、簡潔かつ具体的なアドバイスを提供してください。' },
            { role: 'user', content: prompt }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000,
        });
        
        const result = response.choices[0]?.message?.content || '';
        
        // 結果をキャッシュに保存
        if (useCache && result) {
          responseCache.set(cacheKey, result);
        }
        
        return result;
      } catch (error: any) {
        attempts++;
        console.error(`モデル ${currentModel} でのAI生成に失敗:`, error?.message || error);
        
        // 403や404エラーの場合、フォールバックモデルを試す
        if (error?.status === 403 || error?.status === 404) {
          const fallbackModel = getFallbackModel(currentModel);
          
          // フォールバックモデルが同じなら終了
          if (fallbackModel === currentModel) {
            throw new Error(`利用可能なモデルがありません: ${error.message}`);
          }
          
          console.log(`モデル ${currentModel} → ${fallbackModel} にフォールバック`);
          currentModel = fallbackModel;
        } else {
          // その他のエラーはそのまま再スロー
          throw error;
        }
      }
    }
    
    throw new Error('最大試行回数を超えました。利用可能なAIモデルが見つかりません。');
  } catch (error) {
    console.error('AI応答の生成に失敗しました:', error);
    throw error;
  }
}

/**
 * キャッシュをクリア
 */
export function clearAIResponseCache() {
  responseCache.clear();
  console.log('AIレスポンスのキャッシュをクリアしました');
} 