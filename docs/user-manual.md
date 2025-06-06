# 1on1アシスタント ユーザーマニュアル

## はじめに

1on1アシスタントは、マネージャーの1on1ミーティングをより効果的にするためのローカルWebアプリケーションです。AIを活用してコーチング型マネジメントとSL理論に基づくアドバイスを提供し、マネージャーの成長を支援します。

## 主な機能

- メンバー情報の管理
- 1on1記録の管理
- AI支援機能
- マネジメントスタイル分析

## 基本操作

### ホーム画面

ホーム画面では、以下の主要機能にすばやくアクセスできます：

- **メンバー管理**: チームメンバー情報の管理
- **マネジメントスタイル分析**: 1on1記録に基づくコミュニケーションスタイルの分析
- **設定**: OpenAI APIキーやモデル選択などの設定

### ナビゲーション

画面上部のナビゲーションバーから以下の機能にアクセスできます：

- **ホーム**: ホーム画面に戻る
- **メンバー**: メンバー一覧画面に移動
- **設定**: アプリケーション設定画面に移動

## メンバー管理

### メンバー一覧

1. ホーム画面またはナビゲーションバーから「メンバー」をクリック
2. メンバー一覧画面で登録済みのメンバーを確認
3. 「＋新規メンバー」ボタンをクリックして新しいメンバーを追加

### メンバー作成

1. メンバー一覧画面で「＋新規メンバー」ボタンをクリック
2. 以下の情報を入力：
   - **名前**: メンバーの名前
   - **役職**: メンバーの役職
   - **強み**: メンバーの強み
   - **弱み**: メンバーの弱み
   - **成長プラン**: メンバーの成長プラン
3. 「保存」ボタンをクリックして登録完了

### メンバー詳細

1. メンバー一覧画面で確認したいメンバーのカードをクリック
2. メンバー詳細画面でメンバーの情報を確認
3. 「編集」ボタンで情報を編集、「削除」ボタンでメンバーを削除
4. 「新規セッション」ボタンで新しい1on1記録を作成

## 1on1記録管理

### 1on1記録の作成

1. メンバー詳細画面で「新規セッション」ボタンをクリック
2. 以下の情報を入力：
   - **日付**: 1on1実施日
   - **時間**: 1on1の所要時間（デフォルト30分）
   - **内容**: 1on1で話し合った内容
3. 「保存」ボタンをクリックして登録完了

### 1on1記録の表示

1. メンバー詳細画面の「1on1履歴」セクションで過去の記録を確認
2. 各記録をクリックすると詳細画面に移動
3. 詳細画面では以下の情報を確認できます：
   - 日付と時間
   - 記録内容
   - AIアドバイス（OpenAI APIキーが設定されている場合）
   - 編集・削除機能

### 1on1記録の編集・削除

1. 1on1記録の詳細画面で「編集」ボタンをクリック
2. 内容を編集して「保存」ボタンをクリック
3. 削除する場合は「削除」ボタンをクリックし、確認ダイアログで「削除」を選択

## AI支援機能

### OpenAI API設定

1. ナビゲーションバーの「設定」をクリック
2. OpenAI APIキーを入力
3. 使用するAIモデルを選択：
   - GPT-4o (推奨)
   - GPT-4-turbo
   - GPT-3.5-turbo
4. 「保存」ボタンをクリックして設定を保存

### AIアドバイス

1. OpenAI APIキーを設定した状態で1on1記録を作成または表示
2. 1on1記録の詳細画面で自動的にAIアドバイスが表示されます
3. AIアドバイスには以下が含まれます：
   - 会話のパターン分析
   - コーチング観点からの改善提案
   - SL理論に基づくマネジメントスタイル提案
   - 次回の1on1で聞くべき質問

## マネジメントスタイル分析

### 総合分析

1. ホーム画面の「マネジメントスタイル分析」カードをクリック
2. 総合分析画面では、すべてのメンバーとの1on1記録に基づく分析結果が表示されます
3. 期間を選択して特定の期間の分析結果を確認可能

### メンバー別分析

1. メンバー詳細画面で「マネジメントスタイル分析」リンクをクリック
2. 選択したメンバーとの1on1記録に基づく分析結果が表示されます
3. 期間を選択して特定の期間の分析結果を確認可能

## 設定

### OpenAI API設定

1. ナビゲーションバーの「設定」をクリック
2. OpenAI APIキーを入力
3. 使用するAIモデルを選択
4. 「保存」ボタンをクリックして設定を保存

### アプリケーション設定

将来的な拡張機能のために予約されたセクションです。現在は利用できません。

## ショートカットキー

- <kbd>Alt</kbd> + <kbd>H</kbd>: ホーム画面に移動
- <kbd>Alt</kbd> + <kbd>M</kbd>: メンバー一覧に移動
- <kbd>Alt</kbd> + <kbd>S</kbd>: 設定画面に移動
- <kbd>Esc</kbd>: 現在のダイアログやポップアップを閉じる

## モバイル対応

1on1アシスタントはスマートフォンやタブレットからもアクセスできます。デバイスのサイズに応じて最適化されたUIが表示されます。

## ダークモード

アプリケーションはシステム設定に応じて自動的にダークモードに切り替わります。また、画面右上のテーマ切り替えボタンでも手動で切り替えることができます。

## トラブルシューティング

- **AIアドバイスが表示されない**: OpenAI APIキーが正しく設定されているか確認してください
- **ページが正しく表示されない**: ブラウザをリロードするか、キャッシュをクリアしてください
- **データが保存されない**: データベースのアクセス権限を確認してください 