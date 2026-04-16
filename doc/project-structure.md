# プロジェクトディレクトリ構成

**作成日: 2026年4月16日**

---

## 全体構成

```
OVR001_souzoku/
├── doc/                          # ドキュメント（要件定義・設計書）
│   ├── business-strategy.md      # ビジネス戦略書
│   ├── system-requirements.md    # システム要件定義書
│   ├── design-system.md          # デザインシステム
│   ├── tech-stack.md             # 技術スタック
│   └── project-structure.md      # 本ファイル
│
├── frontend/                     # Next.js アプリケーション
│   ├── src/
│   │   ├── app/                  # App Router ページ
│   │   │   ├── (public)/         # 公開ページ（トップ、物件一覧、SEO）
│   │   │   │   ├── page.tsx
│   │   │   │   ├── properties/
│   │   │   │   │   ├── page.tsx              # 物件一覧
│   │   │   │   │   ├── [id]/page.tsx         # 物件詳細
│   │   │   │   │   ├── area/[name]/page.tsx  # エリア別SEO
│   │   │   │   │   └── type/[type]/page.tsx  # 種別別SEO
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (auth)/           # 認証ページ
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── (dashboard)/      # 認証後ダッシュボード
│   │   │   │   ├── seller/       # 売主ダッシュボード
│   │   │   │   │   ├── properties/
│   │   │   │   │   ├── bids/
│   │   │   │   │   └── documents/
│   │   │   │   ├── buyer/        # 買い手ダッシュボード
│   │   │   │   │   ├── search/
│   │   │   │   │   └── bids/
│   │   │   │   ├── professional/ # 士業ダッシュボード
│   │   │   │   │   ├── referrals/
│   │   │   │   │   ├── earnings/
│   │   │   │   │   └── clients/
│   │   │   │   ├── broker/       # 業者ダッシュボード
│   │   │   │   │   ├── cases/
│   │   │   │   │   └── inquiries/
│   │   │   │   ├── admin/        # 管理ダッシュボード
│   │   │   │   │   ├── properties/
│   │   │   │   │   ├── bids/
│   │   │   │   │   ├── professionals/
│   │   │   │   │   ├── brokers/
│   │   │   │   │   ├── revenue/
│   │   │   │   │   └── dashboard/
│   │   │   │   └── layout.tsx    # サイドナビ付きレイアウト
│   │   │   │
│   │   │   ├── globals.css       # デザイントークン
│   │   │   └── layout.tsx        # ルートレイアウト
│   │   │
│   │   ├── components/           # UIコンポーネント
│   │   │   ├── ui/               # shadcn/ui ベースコンポーネント
│   │   │   ├── property/         # 物件関連（PropertyCard等）
│   │   │   ├── bid/              # 入札関連
│   │   │   ├── layout/           # ヘッダー、フッター、ナビ
│   │   │   └── shared/           # 汎用（StatusBadge, PriceDisplay等）
│   │   │
│   │   ├── hooks/                # カスタムフック
│   │   ├── lib/                  # ユーティリティ
│   │   │   ├── api.ts            # Hono RPCクライアント
│   │   │   ├── supabase/         # Supabaseクライアント設定
│   │   │   └── utils.ts          # 汎用ユーティリティ
│   │   └── types/                # 共有型定義
│   │
│   ├── public/                   # 静的ファイル
│   ├── package.json
│   └── tsconfig.json
│
├── api/                          # Hono バックエンド API
│   ├── src/
│   │   ├── index.ts              # エントリポイント
│   │   ├── routes/               # ルート定義（ドメイン別）
│   │   │   ├── property.ts       # 物件・書類審査
│   │   │   ├── bid.ts            # 入札・ステートマシン
│   │   │   ├── partner.ts        # 士業パートナー・NW管理
│   │   │   ├── broker.ts         # 業者連携・案件管理
│   │   │   ├── revenue.ts        # 収益計算・請求書
│   │   │   ├── notification.ts   # 通知振り分け
│   │   │   └── auth.ts           # 認証関連
│   │   │
│   │   ├── services/             # ビジネスロジック
│   │   │   ├── property.service.ts
│   │   │   ├── bid.service.ts
│   │   │   ├── partner.service.ts
│   │   │   ├── broker.service.ts
│   │   │   ├── revenue.service.ts
│   │   │   └── notification.service.ts
│   │   │
│   │   ├── db/                   # データベース
│   │   │   ├── schema/           # Drizzle スキーマ定義
│   │   │   │   ├── user.ts
│   │   │   │   ├── property.ts
│   │   │   │   ├── bid.ts
│   │   │   │   ├── partner.ts
│   │   │   │   ├── broker.ts
│   │   │   │   ├── revenue.ts
│   │   │   │   ├── notification.ts
│   │   │   │   └── index.ts
│   │   │   ├── migrations/       # マイグレーションファイル
│   │   │   └── client.ts         # DB接続設定
│   │   │
│   │   ├── middleware/           # ミドルウェア
│   │   │   ├── auth.ts           # JWT検証・ロールチェック
│   │   │   └── logger.ts         # リクエストログ
│   │   │
│   │   └── lib/                  # ユーティリティ
│   │       ├── constants.ts      # 定数（ステータス、配分率等）
│   │       └── errors.ts         # エラー定義
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.toml             # Cloudflare Workers設定
│
├── packages/                     # 共有パッケージ（モノレポ）
│   └── shared/                   # フロント・API共通
│       ├── types/                # 共有型定義
│       │   ├── property.ts
│       │   ├── bid.ts
│       │   ├── user.ts
│       │   └── index.ts
│       └── constants/            # 共有定数
│           ├── status.ts         # ステータス定義
│           └── index.ts
│
├── CLAUDE.md                     # AIエージェントルール
├── .gitignore
└── package.json                  # ワークスペースルート
```

---

## 設計方針

### Route Groups によるレイアウト分離

Next.js App Router の Route Groups `(public)`, `(auth)`, `(dashboard)` を使い、レイアウトを分離する。

| グループ | レイアウト | 認証 |
|---------|----------|------|
| `(public)` | ヘッダー + フッター | 不要 |
| `(auth)` | 最小限（ロゴのみ） | 不要 |
| `(dashboard)` | サイドナビ + ヘッダー | 必要 |

### ダッシュボードのロール別分離

`(dashboard)/seller/`, `(dashboard)/buyer/` 等でロール別にページを分け、ナビの出し分けは `layout.tsx` で行う。

### APIのドメイン分離

`api/src/routes/` でドメインごとにファイルを分け、`api/src/services/` にビジネスロジックを集約する。ルートは薄く保ち、バリデーション→サービス呼び出し→レスポンスの流れに統一する。

### 共有型の管理

`packages/shared/` にフロント・API両方で使う型定義と定数を置く。ステータスの文字列リテラルはここで一元管理し、UIのバッジ色やAPIのバリデーションで同じ定義を参照する。
