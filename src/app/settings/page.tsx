'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Settings = {
  id: number;
  openaiApiKey: string;
  aiModel: string;
  updatedAt: string;
};

// 利用可能なOpenAIモデルのリスト
const AVAILABLE_MODELS = [
  { id: 'gpt-4o-2024-05-13', name: 'GPT-4o (推奨)' },
  { id: 'gpt-4-turbo-2024-04-09', name: 'GPT-4 Turbo' },
  { id: 'gpt-3.5-turbo-0125', name: 'GPT-3.5 Turbo (高速・低コスト)' }
];

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('設定の取得に失敗しました');
        }
        const data = await response.json();
        setSettings(data);
        setApiKey(data.openaiApiKey || '');
        setSelectedModel(data.aiModel || 'gpt-4o');
      } catch (err) {
        console.error('設定の取得エラー:', err);
        setError('設定の取得に失敗しました。後でもう一度お試しください。');
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openaiApiKey: apiKey,
          aiModel: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('設定の保存に失敗しました');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSuccess('設定が正常に保存されました');
    } catch (err) {
      console.error('設定の保存エラー:', err);
      setError('設定の保存に失敗しました。後でもう一度お試しください。');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0 animate-in">
        <h1 className="text-2xl sm:text-3xl font-bold">設定</h1>
        <Link
          href="/"
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto text-center"
        >
          ホームに戻る
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded text-sm animate-in">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-300 rounded text-sm animate-in">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full animate-in" style={{ animationDelay: '50ms' }}>
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-lg shadow-md dark:shadow-gray-900/20 transition-all duration-300">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">OpenAI API設定</h2>
          
          <div className="mb-3 sm:mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              APIキー
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
              placeholder="sk-..."
            />
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              OpenAI APIキーは安全に保存され、AIアドバイス機能のために使用されます。
            </p>
          </div>

          <div className="mb-3 sm:mb-4">
            <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              AIモデル
            </label>
            <select
              id="aiModel"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              GPT-4oは最新の高性能モデルで推奨されますが、コスト削減のためにGPT-3.5を選択することもできます。
            </p>
          </div>

          <div className="flex items-center mt-4 sm:mt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-3 py-2 sm:px-4 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
            >
              {saving ? '保存中...' : '設定を保存'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 