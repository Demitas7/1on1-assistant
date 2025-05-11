# システム構造設計

## アーキテクチャ概要
- Next.jsによるフルスタックアプリケーション
- App Routerによるサーバーコンポーネント活用
- Server Actionsによるデータ操作
- ローカルSQLiteデータベース
- OpenAI APIとの連携

## ディレクトリ構造
```
src/
├── app/              # App Router pages
│   ├── members/      # メンバー管理
│   ├── one-on-ones/  # 1on1記録
│   └── settings/     # 設定
├── components/       # 共通コンポーネント
│   ├── ui/          # 基本UIコンポーネント
│   ├── members/     # メンバー関連コンポーネント
│   └── one-on-ones/ # 1on1関連コンポーネント
├── lib/             # 共通ライブラリ
│   ├── db/         # データベース関連
│   ├── actions/    # Server Actions
│   ├── ai/         # AI機能関連
│   └── utils/      # ユーティリティ
├── hooks/           # カスタムフック
├── store/           # 状態管理（Zustand）
└── types/           # 型定義

prisma/               # Prismaの設定とスキーマ
├── schema.prisma    # データベーススキーマ
└── migrations/      # マイグレーションファイル
```

## データフロー

### メンバー管理
1. ユーザーアクション（UI）
2. クライアントコンポーネントからServer Actionを呼び出し
3. Server Action内でPrismaクエリを実行
4. SQLiteデータベースとの通信
5. 結果をクライアントに返却

### 1on1記録
1. ユーザーアクション（UI）
2. クライアントコンポーネントからServer Actionを呼び出し
3. Server Action内でPrismaクエリを実行
4. 必要に応じてOpenAI APIを呼び出し
5. データベースに結果を保存
6. 結果をクライアントに返却

### AI機能
1. Server Actionによる1on1記録データ取得
2. プロンプト生成
3. OpenAI API呼び出し
4. レスポンス解析
5. 結果の保存/表示

## 状態管理
- Zustandによるグローバル状態管理
- React Query / SWRによるサーバー状態管理
- フォーム状態（React Hook Form）

## エラーハンドリング
- アプリケーションエラー
- データベースエラー
- OpenAI APIエラー
- バリデーションエラー

## パフォーマンス最適化
- サーバーコンポーネントの活用
- 適切なキャッシュ戦略
- 必要に応じた再検証
- 最適化されたデータフェッチ 