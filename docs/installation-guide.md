# 1on1アシスタント インストールガイド

## システム要件

- **オペレーティングシステム**: Windows 10/11、macOS 10.15以降、Ubuntu 20.04以降
- **Node.js**: バージョン18.0.0以上
- **パッケージマネージャー**: pnpm v7.0.0以上（推奨）または npm v8.0.0以上
- **ディスク容量**: 最低500MB以上の空き容量
- **メモリ**: 最低4GB RAM
- **OpenAI API**: AI機能を使用する場合はOpenAI APIキー（オプション）

## インストール手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/1on1-assistant.git
cd 1on1-assistant
```

### 2. 依存関係のインストール

```bash
# pnpm推奨（npmではパッケージマネージャーのエラーが発生する場合があります）
pnpm install

# または npm を使用する場合
npm install
```

### 3. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の内容を設定します：

```
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_openai_api_key" # オプション（AI機能を使用する場合）
```

### 4. データベースの初期化

```bash
npx prisma migrate dev
```

### 5. 開発サーバーの起動

```bash
# pnpmを使用する場合
pnpm dev

# npmを使用する場合
npm run dev
```

### 6. アプリケーションへのアクセス

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスします。

## 本番環境用ビルド

開発サーバーではなく、最適化されたビルドを実行する場合：

```bash
# ビルドの実行
pnpm build
# または
npm run build

# ビルドの実行と起動
pnpm start
# または
npm start
```

ビルドしたアプリケーションは [http://localhost:3000](http://localhost:3000) でアクセスできます。

## トラブルシューティング

### よくある問題

1. **`Cannot read properties of null (reading 'matches')` エラー**
   - 解決策: pnpmを使用してパッケージをインストールする
   
   ```bash
   pnpm install
   ```

2. **Radix UIコンポーネントの依存関係エラー**
   - 解決策: 不足しているRadix UIパッケージをインストールする
   
   ```bash
   pnpm add @radix-ui/react-label @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
   ```

3. **Prismaマイグレーションエラー**
   - 解決策: データベースをリセットしてからマイグレーションを再実行
   
   ```bash
   npx prisma migrate reset
   npx prisma migrate dev
   ```

4. **OpenAI API関連のエラー**
   - 解決策: 有効なAPIキーが設定されているか確認し、設定ページでAPIキーを更新

### ファイアウォール設定

ローカルネットワーク内の他のマシンからアクセスする場合は、ポート3000への接続を許可するようにファイアウォールを設定する必要があります。

## アップグレード手順

最新バージョンにアップグレードする場合：

```bash
# リポジトリの最新コードを取得
git pull

# 依存関係の更新
pnpm install
# または
npm install

# データベースの更新
npx prisma migrate dev

# 再ビルド
pnpm build
# または
npm run build
``` 