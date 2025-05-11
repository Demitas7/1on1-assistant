# 1on1アシスタント

1on1アシスタントは、マネージャーの1on1ミーティングをより効果的にするためのローカルWebアプリケーションです。AIを活用してコーチング型マネジメントとSL理論に基づくアドバイスを提供し、マネージャーの成長を支援します。

## 機能

- メンバー情報の管理（名前、役職、特性等）
- 1on1記録の管理（日付、内容、次のアクション）
- AI支援機能（OpenAI APIによるフィードバック提供）
- マネージャー分析（コミュニケーションスタイル診断）

## 技術スタック

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全なJavaScript
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
- [Prisma](https://www.prisma.io/) - Node.js/TypeScript用ORM
- [SQLite](https://www.sqlite.org/) - ローカルデータベース
- [OpenAI API](https://openai.com/blog/openai-api) - AI機能

## 開発環境のセットアップ

### 前提条件

- Node.js 18.0.0以上
- pnpm v7.0.0以上（推奨）または npm v8.0.0以上

### インストール手順

1. リポジトリをクローン
   ```bash
   git clone https://github.com/Demitas7/1on1-assistant.git
   cd 1on1-assistant
   ```

2. 依存関係のインストール
   ```bash
   # pnpm推奨（npmではパッケージマネージャーのエラーが発生する場合があります）
   pnpm install
   
   # または npm を使用する場合
   npm install
   ```

3. データベースの初期化
   ```bash
   npx prisma migrate dev
   ```

4. 開発サーバーの起動
   ```bash
   npm run dev
   # または
   pnpm dev
   ```

5. ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認

### 環境変数の設定

1. `.env` ファイルをプロジェクトルートに作成
   ```
   DATABASE_URL="file:./dev.db"
   OPENAI_API_KEY="your_openai_api_key" # オプション（AI機能を使用する場合）
   ```

## 主要な機能の使い方

### メンバー管理

1. メンバー一覧画面から「新規メンバー」ボタンをクリック
2. 名前、役職を入力して保存
3. メンバー詳細画面でメンバー情報を確認・編集

### 1on1記録管理

1. メンバー詳細画面から「新規セッション」ボタンをクリック
2. 日付、会話内容、次のアクションを入力して保存
3. 保存した1on1記録を一覧で確認

### AI機能

1. 設定画面でOpenAI APIキーを設定
2. 1on1記録から自動的にアドバイスが生成される

## トラブルシューティング

### よくある問題

1. `Cannot read properties of null (reading 'matches')` エラー
   - 解決策: pnpmを使用してパッケージをインストールする
   
   ```bash
   pnpm install
   ```

2. Radix UIコンポーネントの依存関係エラー
   - 解決策: 不足しているRadix UIパッケージをインストールする
   
   ```bash
   pnpm add @radix-ui/react-label @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
   ```

## ライセンス

MIT
