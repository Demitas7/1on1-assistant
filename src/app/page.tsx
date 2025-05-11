'use client';

import Link from 'next/link';
import { memo } from 'react';

// ナビゲーションカードコンポーネント
const NavCard = memo(function NavCard({ 
  href, 
  title, 
  description, 
  linkText = "詳細を見る →" 
}: { 
  href: string; 
  title: string; 
  description: string; 
  linkText?: string;
}) {
  return (
    <Link 
      href={href} 
      prefetch={false} // 必要になるまでプリフェッチを無効化
      className="block bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
        {description}
      </p>
      <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base">{linkText}</div>
    </Link>
  );
});

// AI機能セクションコンポーネント
const AIFeaturesSection = memo(function AIFeaturesSection() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 rounded-lg mb-8 sm:mb-12 shadow-md transition-all">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">AI支援機能</h2>
      <p className="mb-3 sm:mb-4 text-sm sm:text-base dark:text-gray-300">
        OpenAI APIを活用して、以下のAI機能が利用可能です：
      </p>
      <ul className="list-disc pl-5 mb-4 space-y-1 sm:space-y-2 text-sm sm:text-base dark:text-gray-300">
        <li>
          <span className="font-medium">コーチングアドバイス：</span>
          1on1記録を分析し、コーチング視点からのフィードバックとSL理論に基づいたリーダーシップスタイルを提案
        </li>
        <li>
          <span className="font-medium">次回の質問リスト：</span>
          前回の1on1内容に基づいて、次回のミーティングで使用できる効果的な質問リストを生成
        </li>
        <li>
          <span className="font-medium">マネジメントスタイル分析：</span>
          複数の1on1記録から、あなたのコミュニケーションパターンやリーダーシップスタイルを分析し改善点を提案
        </li>
      </ul>
      <div className="flex space-x-3">
        <Link 
          href="/settings" 
          prefetch={false}
          className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300"
        >
          APIキーを設定する
        </Link>
      </div>
    </section>
  );
});

// フッターコンポーネント
const Footer = memo(function Footer() {
  return (
    <footer className="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm py-2">
      <p>© 2024 1on1アシスタント</p>
    </footer>
  );
});

// ホームページコンポーネント
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 md:py-12">
      <header className="mb-6 sm:mb-8 md:mb-12 text-center animate-in">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">1on1アシスタント</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          マネージャーの1on1ミーティングをより効果的にするためのツール
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <NavCard 
          href="/members" 
          title="メンバー管理" 
          description="チームメンバーの情報を登録・管理します。メンバーごとの特性や役職などを記録できます。"
          linkText="メンバー一覧を見る →"
        />

        <NavCard 
          href="/analysis" 
          title="マネジメントスタイル分析" 
          description="1on1記録を分析し、あなたのコミュニケーションパターンやリーダーシップスタイルを診断します。"
          linkText="分析を開始する →"
        />

        <NavCard 
          href="/settings" 
          title="設定" 
          description="OpenAI APIキーの設定やAIモデルの選択など、アプリケーションの設定を行います。"
          linkText="設定を開く →"
        />
      </div>

      <AIFeaturesSection />
      <Footer />
    </div>
  );
}
