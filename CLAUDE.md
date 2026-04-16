# Ouver 相続不動産マッチング — AIエージェントルール

## プロジェクト概要

相続で不動産を取得した売主が、士業の紹介を通じて物件を掲載し、入札方式で短期間に売却できるプラットフォーム。

- **会社**: Ouver株式会社
- **ドメイン**: 相続不動産 × 入札 × 士業ネットワーク
- **ユーザーロール**: seller（売主）, buyer（買い手）, professional（士業）, broker（提携業者）, admin（管理者）

---

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| バックエンドAPI | Hono (TypeScript) |
| ORM | Drizzle |
| DB | Supabase PostgreSQL |
| 認証 | BetterAuth (Google / Apple / LINE OAuth) |
| ストレージ | Supabase Storage |
| メール | Resend + React Email |
| PDF | @react-pdf/renderer |
| デプロイ | Vercel (フロント) + Cloudflare Workers (API) |

---

## ドキュメント参照先

作業前に必ず参照すべきドキュメント:

| ファイル | 内容 |
|---------|------|
| `doc/system-requirements.md` | システム要件定義書（機能仕様の正） |
| `doc/business-strategy.md` | ビジネス戦略書（ドメイン知識） |
| `doc/design-system.md` | デザインシステム（色・フォント・コンポーネント） |
| `doc/tech-stack.md` | 技術スタック選定理由 |
| `doc/project-structure.md` | ディレクトリ構成 |

---

## コーディング規約

### 言語・フォーマット

- TypeScript strict mode
- セミコロンなし（Prettier準拠）
- シングルクォート
- インデント: スペース2つ
- 関数: アロー関数を基本とする
- 型: `interface` よりも `type` を優先（union型との一貫性）

### 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| ファイル名（コンポーネント） | PascalCase | `PropertyCard.tsx` |
| ファイル名（それ以外） | kebab-case | `bid.service.ts` |
| コンポーネント | PascalCase | `PropertyCard` |
| 関数 | camelCase | `calculateCommission` |
| 定数 | UPPER_SNAKE_CASE | `BID_STATUS` |
| 型 | PascalCase | `PropertyStatus` |
| DBカラム | snake_case | `created_at` |
| APIパス | kebab-case | `/api/properties/:id/bids` |
| CSS変数 | kebab-case | `--color-primary-500` |

### ディレクトリ規約

- `frontend/src/app/` — ページコンポーネントのみ。ビジネスロジックを書かない
- `frontend/src/components/` — 再利用可能なUIコンポーネント
- `frontend/src/components/ui/` — shadcn/ui のベースコンポーネント。手動で変更しない
- `api/src/routes/` — ルート定義。薄く保つ（バリデーション → service呼び出し → レスポンス）
- `api/src/services/` — ビジネスロジック。テスト可能な純粋関数で書く
- `api/src/db/schema/` — Drizzle スキーマ定義
- `packages/shared/` — フロント・API共通の型と定数

---

## デザイン規約

### 色の使い分け（厳守）

| 色 | 用途 | 禁止事項 |
|----|------|---------|
| Primary（ネイビー） | ナビ、見出し、選択状態 | CTAボタンに使わない |
| Secondary（翠） | タグ、補助的な強調 | メインアクションに使わない |
| CTA（オレンジ） | 主要アクションボタンのみ | 状態表示に使わない |
| Success（緑） | 成約、完了 | 他の「良い状態」に流用しない |
| Warning（黄） | 期限注意、承認待ち | — |
| Error（赤） | 差戻し、エラー | 装飾に使わない |
| Info（青） | 情報通知 | — |

### ステータスバッジのルール

- **Solid** = 確定状態（公開、成約、入札受付中）
- **Outline** = 暫定・要対応状態（審査待ち、差戻し、登記中）
- 同じ意味のステータスには必ず同じ色を使う

### 価格表示

- `.price` クラスを使用（Inter フォント、tabular-nums）
- 常に「万円」表記
- 桁区切りカンマあり（例: `3,500 万円`）

### レスポンシブ

- モバイルファースト
- ブレークポイント: sm(640) / md(768) / lg(1024) / xl(1280)

---

## ドメイン知識（コード記述時に参照）

### ユーザーロールと権限

| ロール | できること |
|--------|----------|
| seller | 物件登録、書類アップロード、入札確認、入札者選択、書類閲覧許可 |
| buyer | 物件検索、入札、問い合わせ |
| professional | 紹介リンク発行、代理登録、紹介案件閲覧、報酬確認 |
| broker | 案件ステータス更新、書類アップロード、問い合わせ対応 |
| admin | 全機能 + 審査、承認、業者割当、収益管理 |

### 主要ステータス

#### 物件ステータス

```
審査待ち → 公開 → 入札受付中 → 入札終了 → 承認待ち → 成約
                                                    → 差戻し
                               → 不成立 → 通常掲載 / 再出品
         → 差戻し → 審査待ち（再提出）
公開(登記中) → 2ヶ月で自動差戻し / 登記完了で公開
```

#### 案件ステータス

```
業者割当済み → 売主連絡済み → 買い手連絡済み → 重説完了 → 契約締結 → 決済完了
                                                                  → 案件中止
```

### 報酬配分

| パターン | 業者 | Ouver | 士業 | NW |
|---------|------|-------|------|-----|
| NW経由 | 50% | 32% | 15% | 3% |
| 直接紹介 | 50% | 35% | 15% | 0% |

段階的手数料率あり（最初5件: 業者60%、6-20件: 55%、21件〜: 50%）

### 仲介手数料計算

```
400万円超の場合: 売買価格 × 3% + 6万円（税別）
両手仲介: 上記 × 2
```

---

## 禁止事項

- `any` 型の使用（`unknown` + type guardを使う）
- `console.log` のコミット（ロガーを使う）
- インラインスタイル（Tailwindクラスを使う）
- shadcn/ui の `components/ui/` 配下の直接編集（ラッパーで拡張する）
- 環境変数のハードコーディング
- 日本語のコメント中に英単語を混ぜない（コードのコメントは日本語で統一）
- RLSに複雑な業務ロジックを書く（アプリ層で実装する）

---

## Git 運用

- ブランチ名: `feature/xxx`, `fix/xxx`, `refactor/xxx`
- コミットメッセージ: 日本語OK。先頭に絵文字不要
- 1コミット = 1つの変更目的
- `main` への直接プッシュ禁止
