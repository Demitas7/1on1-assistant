#!/bin/bash

# インストール手順検証スクリプト

echo "1on1アシスタント インストール検証スクリプト"
echo "========================================"

# 必要なツールの確認
echo "必要なツールの確認中..."
command -v node >/dev/null 2>&1 || { echo "Node.jsがインストールされていません。インストールしてください。"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npmがインストールされていません。インストールしてください。"; exit 1; }

node_version=$(node -v)
echo "Node.jsバージョン: $node_version"

# node_versionから数値部分を取り出す
node_version_number=$(echo $node_version | sed 's/v//')
major_version=$(echo $node_version_number | cut -d. -f1)

# Node.jsのバージョン確認
if [ $major_version -lt 18 ]; then
  echo "エラー: Node.js v18.0.0以上が必要です。"
  exit 1
fi

# pnpmの確認
if command -v pnpm >/dev/null 2>&1; then
  pnpm_version=$(pnpm -v)
  echo "pnpmバージョン: $pnpm_version"
  use_pnpm=true
else
  echo "pnpmがインストールされていません。npmを使用します。"
  use_pnpm=false
fi

# テスト用ディレクトリ作成
test_dir="1on1-assistant-test"
echo "テスト用ディレクトリ作成中: $test_dir"
if [ -d "$test_dir" ]; then
  echo "テストディレクトリが既に存在します。クリーンな状態でテストするため削除します。"
  rm -rf "$test_dir"
fi
mkdir -p "$test_dir"
cd "$test_dir"

# gitが利用可能か確認
if command -v git >/dev/null 2>&1; then
  # リポジトリのクローン
  echo "リポジトリをクローン中..."
  git clone https://github.com/yourusername/1on1-assistant.git .
  if [ $? -ne 0 ]; then
    echo "リポジトリのクローンに失敗しました。手動で確認してください。"
    exit 1
  fi
else
  echo "gitがインストールされていないため、リポジトリのクローンをスキップします。"
  echo "プロジェクトファイルをこのディレクトリにコピーしてください。"
  exit 1
fi

# 依存関係のインストール
echo "依存関係をインストール中..."
if [ "$use_pnpm" = true ]; then
  pnpm install
  if [ $? -ne 0 ]; then
    echo "pnpmによる依存関係のインストールに失敗しました。"
    exit 1
  fi
else
  npm install
  if [ $? -ne 0 ]; then
    echo "npmによる依存関係のインストールに失敗しました。"
    exit 1
  fi
fi

# .envファイルの作成
echo "環境変数設定中..."
if [ ! -f ".env" ]; then
  echo 'DATABASE_URL="file:./dev.db"' > .env
  echo 'OPENAI_API_KEY="sk-test-key-for-verification"' >> .env
  echo ".envファイルを作成しました。"
else
  echo ".envファイルが既に存在します。"
fi

# Prisma migrate
echo "データベースマイグレーション実行中..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
  echo "データベースマイグレーションに失敗しました。"
  exit 1
fi

# ビルド
echo "アプリケーションをビルド中..."
if [ "$use_pnpm" = true ]; then
  pnpm build
  build_status=$?
else
  npm run build
  build_status=$?
fi

if [ $build_status -ne 0 ]; then
  echo "ビルドに失敗しました。"
  exit 1
fi

echo "インストール検証が完了しました。"
echo "次のコマンドでアプリケーションを起動できます:"
if [ "$use_pnpm" = true ]; then
  echo "  pnpm dev    # 開発モード"
  echo "  pnpm start  # 本番モード"
else
  echo "  npm run dev    # 開発モード"
  echo "  npm start      # 本番モード"
fi

echo ""
echo "ブラウザで http://localhost:3000 にアクセスしてアプリケーションを確認してください。"

cd ..
echo "検証完了。テストディレクトリ: $test_dir" 