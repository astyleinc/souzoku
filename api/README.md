# Ouver API

相続不動産マッチングプラットフォームのバックエンドAPI（Hono + Drizzle + Supabase）。

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数

`.env.example` を `.env` にコピーし、必要な値を設定してください。

```bash
cp .env.example .env
```

主な環境変数:

| キー | 用途 |
|------|------|
| `DATABASE_URL` | PostgreSQL（Supabase）接続文字列 |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Storage 操作用 |
| `RESEND_API_KEY` / `MAIL_FROM` | 通知メール送信 |
| `SLACK_DEFAULT_WEBHOOK_URL` | Slack通知のデフォルト送信先 |
| `INVOICE_ISSUER_ADDRESS` / `INVOICE_ISSUER_QUALIFIED_NUMBER` | 請求書PDFに記載する発行元情報（適格請求書対応） |

### 3. データベースマイグレーション

スキーマ生成と適用を順に実行します。

```bash
pnpm db:generate  # スキーマからSQL生成
pnpm db:migrate   # マイグレーション適用
pnpm db:seed      # シードデータ投入
```

ワンショットで実行する場合は `pnpm db:setup`。

#### 個別マイグレーションの適用

新規マイグレーションを個別に当てる必要がある場合は、`src/db/migrations/` 配下のSQLを直接適用してください。

- `0003_add_invoice_target_type.sql` — 請求書テーブルに `target_type`（broker / professional / nw）カラムを追加。請求書PDF機能の利用には **必須**。
- `0004_add_inheritance_start_date.sql` — 物件テーブルに `inheritance_start_date` カラムを追加。相続開始日カウントダウン機能の利用には **必須**。

```bash
psql "$DATABASE_URL" -f src/db/migrations/0003_add_invoice_target_type.sql
psql "$DATABASE_URL" -f src/db/migrations/0004_add_inheritance_start_date.sql
```

### 4. Supabase Storage バケットの作成

請求書PDF（`api/src/lib/pdf/invoice.ts` で生成）は Supabase Storage の `invoices` バケットに保存されます。
初回デプロイ・ローカル環境では **`invoices` バケットを手動で作成** してください。

Supabase Dashboard からの作成手順:

1. Storage → **New bucket**
2. Name: `invoices`
3. Public bucket: **OFF**（署名付きURLで配布するため非公開のままにする）

CLI から作成する場合:

```bash
curl -X POST "$SUPABASE_URL/storage/v1/bucket" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"id":"invoices","name":"invoices","public":false}'
```

なお、契約書などの既存のユーザー書類用バケット `documents` も別途必要です。

### 5. 開発サーバ起動

```bash
pnpm dev
```

デフォルトで `http://localhost:8787` で起動します。

## ディレクトリ構成

- `src/routes/` — ルート定義（薄く保つ）
- `src/services/` — ビジネスロジック
- `src/db/schema/` — Drizzle スキーマ定義
- `src/db/migrations/` — SQLマイグレーション
- `src/lib/` — 共通ユーティリティ（mail, slack, pdf, storage など）
- `src/jobs/` — Cron ジョブ定義
