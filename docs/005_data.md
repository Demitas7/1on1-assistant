# データ設計

## データベース設計

### Member（メンバー）
```prisma
model Member {
  id        Int         @id @default(autoincrement())
  name      String      // 名前
  jobTitle  String      // 役職
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  oneOnOnes OneOnOne[]  // 1on1記録との関連
}
```

### OneOnOne（1on1記録）
```prisma
model OneOnOne {
  id          Int      @id @default(autoincrement())
  memberId    Int      // メンバーID
  member      Member   @relation(fields: [memberId], references: [id])
  date        DateTime // 実施日
  content     String   // 会話内容
  nextActions String?  // 次のアクション
  aiSummary   String?  // AI生成サマリー
  aiInsights  String?  // AIによるインサイト
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Settings（設定）
```prisma
model Settings {
  id            Int      @id @default(autoincrement())
  openaiApiKey  String?  // OpenAI APIキー
  updatedAt     DateTime @updatedAt
}
```

## データ操作

### メンバー管理
- メンバーの作成
- メンバー情報の更新
- メンバーの削除
- メンバー一覧の取得
- メンバー詳細の取得

### 1on1記録
- 記録の作成
- 記録の更新
- 記録の削除
- 記録一覧の取得（メンバー別、期間別）
- 記録詳細の取得
- AI分析の実行と保存

### 設定管理
- APIキーの設定
- APIキーの取得
- 設定の更新

## データバリデーション

### メンバー
- 名前：必須、1文字以上
- 役職：必須、1文字以上

### 1on1記録
- メンバーID：必須、存在するメンバー
- 実施日：必須、有効な日付
- 会話内容：必須、1文字以上
- 次のアクション：オプション
- AI関連フィールド：オプション

### 設定
- OpenAI APIキー：オプション、有効なAPIキー形式

## データ移行
- SQLiteデータベースファイルのバックアップ
- マイグレーション履歴の管理
- データのエクスポート/インポート機能

## データセキュリティ
- ローカルデータベースの保護
- APIキーの安全な保管
- センシティブデータの扱い 