# 技術スタック

**作成日: 2026年4月16日**
**ステータス: 確定**

---

## 1. アーキテクチャ概要

```
┌──────────────────────────────────────────────┐
│  Frontend: Next.js 16 (App Router)           │
│  - Tailwind CSS v4 + shadcn/ui               │
│  - Vercel にデプロイ                          │
│  - SSR/SSG（SEOページ）+ CSR（ダッシュボード）   │
└──────────────┬───────────────────────────────┘
               │ Hono RPC (型安全なAPI呼び出し)
               ▼
┌──────────────────────────────────────────────┐
│  Backend API: Hono (TypeScript)              │
│  - Cloudflare Workers or Vercel Functions    │
│  - ドメイン分離（後述）                        │
│  - Drizzle ORM                               │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│  Supabase                                    │
│  - PostgreSQL（DB）                           │
│  - Auth（認証・ロール管理）                     │
│  - Storage（書類ファイル）                      │
└──────────────────────────────────────────────┘
```

---

## 2. 技術選定一覧

| レイヤー | 技術 | バージョン | 選定理由 |
|---------|------|-----------|---------|
| **フロントエンド** | Next.js | 16 | SEO + ダッシュボードの両立。App Router。市場シェア最大 |
| **UIフレームワーク** | Tailwind CSS | v4 | CSS-firstの設定。ユーティリティベースで高速開発 |
| **UIコンポーネント** | shadcn/ui | latest | コピー&ペースト方式で完全カスタマイズ可能。管理画面に強い |
| **バックエンドAPI** | Hono | latest | 14KB軽量。Web標準API準拠でロックインなし。RPC機能で型共有 |
| **ORM** | Drizzle | latest | 7.4KBの軽量バンドル。エッジランタイム最適。SQL寄りで複雑なクエリに強い |
| **データベース** | Supabase PostgreSQL | — | マネージドPostgreSQL。RLS対応だが業務ロジックはアプリ層で実装 |
| **認証** | Supabase Auth | — | メール+パスワード認証。カスタムクレームでロール管理 |
| **ファイルストレージ** | Supabase Storage | — | 書類アップロード。バケットポリシーでアクセス制御 |
| **メール送信** | Resend + React Email | — | JSXでテンプレート管理。SendGridより統合速度2倍、コスト40%減 |
| **PDF生成** | @react-pdf/renderer | — | 請求書・支払通知書のインボイス対応PDF |
| **定期実行** | Vercel Cron | — | 登記催促（2週間ごと）、入札期間終了チェック、即決承認期限（48h） |
| **アイコン** | Lucide Icons | — | shadcn/uiのデフォルト。軽量・豊富 |
| **フォント** | Noto Sans JP + Inter | — | 日本語可読性 + 数字の視認性 |
| **デプロイ（フロント）** | Vercel | — | Next.jsとの親和性 |
| **デプロイ（API）** | Cloudflare Workers | — | エッジ実行、グローバル低レイテンシ |

---

## 3. 選定の判断根拠

### 3.1 フロントとバックの分離

ビジネスロジックが重い（入札ステートマシン、報酬配分計算、変更履歴、通知振り分け）ため、Next.js API Routesに直接書くとカオス化する。Honoで分離し、ドメインごとにルーターを整理する。

### 3.2 Hono を選んだ理由

| 比較対象 | 不採用理由 |
|---------|-----------|
| NestJS | 学習コスト高、バンドル大、サーバーレス不向き |
| Express | レガシー化。新規採用は減少トレンド |
| Next.js API Routes | 複雑なドメインロジックの整理に向かない |

Hono はWeb標準API準拠で、Cloudflare Workers → Node.js → Bun どこでも動く。ロックインが最も小さい。

### 3.3 Drizzle を選んだ理由

| 比較対象 | 判断 |
|---------|------|
| Prisma 7 | TypeScript化で改善されたが、Honoのエッジ環境ではDrizzleの方が軽量・高速 |

Drizzle はSQL寄りの書き方なので、複雑なJOIN・集計（報酬配分計算等）を直感的に書ける。

### 3.4 Supabase の使い方

Supabaseは「マネージドインフラ」として使い、業務ロジックはアプリ層に置く。

| 使う機能 | 使わない方針 |
|---------|------------|
| PostgreSQL（マネージドDB） | RLSで複雑な業務ロジック |
| Auth（認証・JWT） | Edge Functions |
| Storage（ファイル） | Realtime（Phase 1では不要） |

---

## 4. フロント ⇔ バックエンドの型共有

Hono のRPC機能を使い、APIの型をフロントエンドに自動共有する。

```typescript
// Backend (Hono)
const app = new Hono()
  .get('/api/properties/:id', async (c) => {
    const property = await getProperty(c.req.param('id'))
    return c.json(property)
  })

export type AppType = typeof app

// Frontend (Next.js)
import { hc } from 'hono/client'
import type { AppType } from '@/api'

const client = hc<AppType>('/api')
const res = await client.properties[':id'].$get({ param: { id: '...' } })
// → 型安全にレスポンスが取れる
```

---

## 5. 外部サービス一覧

| サービス | 用途 | 費用目安 |
|---------|------|---------|
| Vercel | フロントデプロイ | Pro: $20/月 |
| Cloudflare Workers | APIデプロイ | Free〜$5/月 |
| Supabase | DB + Auth + Storage | Pro: $25/月 |
| Resend | メール送信 | Free（100通/日）〜$20/月 |
| Google Fonts | Noto Sans JP, Inter | 無料 |

Phase 1 合計: 約 $70/月（≒1万円/月）

---

## 6. Phase 2 で追加予定

| 技術 | 用途 | Phase |
|------|------|-------|
| Stripe Connect | 自動振込 | Phase 2 |
| LINE Messaging API | LINE通知 | Phase 2 |
| Puppeteer (Cloud Functions) | 士業資格の自動照合（スクレイピング） | Phase 1後半 or Phase 2 |
