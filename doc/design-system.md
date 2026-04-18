# Ouver デザインシステム

**作成日: 2026年4月18日**
**ステータス: Phase 1 — ouver-property-search.html 準拠**

---

## 1. デザイン原則

### 1.1 ブランドポジション

Ouverは相続不動産の専門マッチングプラットフォーム。一般的な不動産ポータル（SUUMO, HOME'S）の「楽しい住まい探し」ではなく、**相続という課題を信頼できる仕組みで解決する**サービス。

| 軸 | 方向性 |
|---|---|
| トーン | カジュアル ← **ここ** → フォーマル |
| 情報密度 | 詰め込み ← → **ここ** ゆとり |
| 配色 | 派手 ← → **ここ** 落ち着き |
| ビジュアル | ナチュラル × セージグリーン |
| 類似ジャンル | リーガルテック、金融系SaaS |

### 1.2 4つの原則

1. **信頼が最優先** — 色・余白・タイポグラフィすべてで「安心して任せられる」印象を作る
2. **数字は明瞭に** — 価格・入札数・報酬額など、金額が意思決定の中心。数字の視認性に妥協しない
3. **ステータスは一目で** — 物件・入札・案件のステータスが多い。色×形で直感的に判別できる体系を持つ
4. **ロールに合わせて削ぐ** — 5つのロールそれぞれに必要な情報だけを見せる。全部入りの画面は作らない

### 1.3 質感の方針

Halftone + Fade Mask をベースとした「主張しない質感」を採用する。

| 質感 | 用途 | 実装 |
|------|------|------|
| Halftone Fade | ヒーロー背景の装飾。写真の上に重ね、情報領域はクリアに保つ | `radial-gradient` ドット + `mask-image` で片側にフェード |
| Grain Noise | ヒーローのグラデーション上に微細な粒感を加える | SVG `feTurbulence` / opacity 4% |
| Halftone Bottom Rise | CTAセクション下部。セクション間の境界を柔らかくする | `mask-image: linear-gradient(0deg, ...)` |
| Halftone Top Edge | フッター上辺。ダーク→ライトの切り替わりを溶かす | `mask-image: linear-gradient(180deg, ...)` |

**3つの制約:**
- コントラストを上げない — ドットの opacity は 0.18 以下
- 密度を上げない — grid-size は 10px 以上
- 1画面に入れすぎない — 最大2つまで

---

## 2. カラーパレット

### 2.1 CSS変数定義（実装値）

```css
:root {
  /* ===== Brand — セージグリーン ===== */
  --sage:        #6b8f71;   /* Primary。ロゴ、ナビCTA、検索ボタン、バッジ、価格 */
  --sage-deep:   #4a6a50;   /* Primary Dark。ホバー、価格テキスト */
  --sage-light:  #e8f0ea;   /* Primary Light。バッジ背景、ホバー背景 */
  --sage-xlight: #f2f6f3;   /* Primary XLight。ソートボタン選択背景 */

  /* ===== Neutral — Bark（暖かいグレー） ===== */
  --bark:        #2a2a2a;   /* 見出し、本文、フッター背景 */
  --bark-2:      #444444;   /* 強調テキスト */
  --bark-3:      #777777;   /* サブテキスト、ナビリンク */
  --bark-4:      #aaaaaa;   /* プレースホルダー、キャプション、ラベル */

  /* ===== Surface — Warm（アイボリー系） ===== */
  --warm:        #f7f5ef;   /* ページ背景、入力フィールド背景 */
  --warm-2:      #eae5d8;   /* ボーダー、区切り線、スペックタグ背景 */
  --warm-3:      #ddd6c6;   /* 強調ボーダー */

  /* ===== Card ===== */
  --card:        #ffffff;   /* カード背景、検索ボックス背景 */

  /* ===== Line ===== */
  --line:        rgba(0, 0, 0, 0.06);  /* 区切り線、ナビ下線 */

  /* ===== Semantic — 状態色（物件・入札ステータス用） ===== */
  /* Badge: NEW */
  /* → --sage (#6b8f71) を使用 */

  /* Badge: 人気 / 入札件数 */
  /* → #c27040（テラコッタ） */

  /* Badge: 入札受付中 / 特典 */
  /* → #5a8fa0（スカイブルー） */

  /* ===== Shadow ===== */
  --shadow-s:    0 1px 3px rgba(0, 0, 0, 0.04);    /* カード通常 */
  --shadow-m:    0 4px 20px -6px rgba(0, 0, 0, 0.08);  /* カードホバー（特徴） */
  --shadow-l:    0 12px 40px -12px rgba(0, 0, 0, 0.10); /* 検索ボックス */
  --shadow-h:    0 20px 50px -12px rgba(0, 0, 0, 0.14); /* カードホバー（物件） */

  /* ===== Radius ===== */
  --r:           10px;      /* カード、検索ボックス */
  --rs:          6px;       /* ボタン、入力フィールド */
}
```

### 2.2 色の役割設計

| 役割 | 変数 | 用途 | 他の役割に使わない |
|------|------|------|----|
| **Brand** | `--sage` / `--sage-deep` | ロゴ、ナビCTA、検索ボタン、価格、選択状態 | — |
| **Surface** | `--warm` / `--warm-2` | ページ背景、入力フィールド、ボーダー | CTAには使わない |
| **Card** | `--card` | カード・検索ボックス・モーダルの背景 | — |
| **Text** | `--bark` 系 | 階層的なテキスト色（4段階） | — |
| **Status: NEW** | `--sage` (solid) | 新着物件バッジ | — |
| **Status: Popular** | `#c27040` (solid) | 人気・入札件数バッジ | ナビやブランド要素には使わない |
| **Status: Deal** | `#5a8fa0` (solid) | 入札受付中・特典バッジ | 装飾には使わない |

### 2.3 ステータスバッジ体系

#### 物件ステータス（現在の実装）

| ステータス | 背景色 | テキスト色 | class |
|-----------|--------|-----------|-------|
| NEW（新着） | `--sage` (#6b8f71) | `#fff` | `.pb-new` |
| 人気 / 入札N件 | `#c27040` | `#fff` | `.pb-pop` |
| 入札受付中 / 特典 | `#5a8fa0` | `#fff` | `.pb-deal` |

#### 拡張予定（管理画面・ダッシュボード向け）

| ステータス | 色 | スタイル |
|-----------|----|----|
| 審査待ち | Neutral (`--bark-4`) | Outline |
| 公開中 | Primary (`--sage`) | Solid |
| 成約 | Success (`#2D8A4E`) | Solid |
| 差戻し | Error (`#C93B3B`) | Outline |
| 期限注意 | Warning (`#D4A017`) | Outline |

---

## 3. タイポグラフィ

### 3.1 フォントスタック

```css
:root {
  --serif: 'Cormorant Garamond', serif;          /* ロゴのイタリック部分 */
  --sans:  'Zen Kaku Gothic New', system-ui, sans-serif;  /* 本文・UI全般 */
  --mono:  'JetBrains Mono', monospace;           /* 件数カウント・コピーライト */
}
```

| 用途 | フォント | 理由 |
|------|---------|------|
| 日本語本文・UI | Zen Kaku Gothic New | ニュートラルな角ゴシック。Noto Sans JPより個性がありつつ可読性を維持 |
| ロゴ・装飾 | Cormorant Garamond (italic) | セリフのコントラストで品を出す。ロゴの `i` タグに限定使用 |
| 数値・カウント | JetBrains Mono | 等幅で数字の視認性を担保。件数バッジ・コピーライトに使用 |

**Google Fonts 読み込み:**

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 3.2 サイズ階層

| 名前 | サイズ | ウェイト | letter-spacing | 用途 |
|------|--------|---------|---------------|------|
| Hero | `clamp(28px, 4.2vw, 44px)` | 700 | -0.02em | ヒーロー見出し |
| H2 Section | 24px | 700 | -0.02em | CTAセクション見出し |
| H2 Results | 18px | 700 | — | セクション見出し |
| H3 Feature | 14px | 700 | -0.01em | 特徴カード見出し |
| Card Name | 15px | 700 | -0.01em | 物件名 |
| Body | 14px | 400 | — | 本文・説明文 |
| Search Input | 13px | 400 | — | フォーム入力 |
| Nav Link | 13px | 500 | — | ナビゲーション |
| Caption | 12px | 400 | — | 特徴説明文、フッターリンク |
| Label | 10px | 700 | 0.06em | フォームラベル（uppercase） |
| Badge | 11px | 700 | 0.02em | ヒーローバッジ |
| Spec | 10px | 400 | — | スペックタグ、エリア表示 |
| Price | 19px | 700 | -0.02em | 物件カード価格 |
| Price Unit | 11px | 400 | — | 「万円」 |

### 3.3 行間

| 用途 | line-height |
|------|-------------|
| ページ全体（body） | 1.7 |
| ヒーロー見出し | 1.3 |
| カード名 | 1.4 |
| 価格 | 1.0 |
| 特徴説明 | 1.6 |
| アクセス表示 | 1.5 |

---

## 4. レイアウト

### 4.1 コンテンツ幅

| 用途 | max-width |
|------|-----------|
| ナビ・結果一覧・特徴・CTA・フッター | 1260px |
| 検索ボックス | 820px |
| ヒーローテキスト（h1） | 560px |
| ヒーローサブテキスト | 440px |

### 4.2 水平パディング

| ブレークポイント | パディング |
|----------------|-----------|
| デスクトップ（781px+） | 36px |
| モバイル（〜780px） | 20px |

### 4.3 ブレークポイント

| 名前 | 幅 | 変化 |
|------|------|------|
| sm | 600px | 物件グリッド → 1列 / 特徴グリッド → 1列 |
| md | 780px | ナビリンク非表示 / ヒーローパディング縮小 |
| lg | 1000px | 物件グリッド 3列 → 2列 |

### 4.4 物件グリッド

```css
.pgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* デスクトップ */
  gap: 18px;
}
/* 1000px以下: repeat(2, 1fr) */
/* 600px以下: 1fr */
```

### 4.5 間隔の実装値

| 用途 | サイズ |
|------|--------|
| ナビ高さ | 56px |
| ヒーローパディング上 | 72px |
| ヒーローパディング下 | 56px |
| 検索ボックス内パディング | 22px 24px |
| カード内パディング | 14px 16px 16px |
| セクション間 | 36px〜80px |
| 物件カード間ギャップ | 18px |
| 特徴カード間ギャップ | 16px |
| フッター上パディング | 40px |

---

## 5. コンポーネント

### 5.1 ナビゲーション

- `position: sticky; top: 0`
- 背景: `rgba(247, 245, 239, 0.88)` + `backdrop-filter: blur(16px)`
- 高さ: 56px
- ロゴマーク: 30×30px、`--sage` 背景、角丸 7px
- ナビCTA: `--sage` 背景、pill形（border-radius: 20px）

### 5.2 ヒーロー

| レイヤー | z-index | 内容 |
|---------|---------|------|
| hero-bg | 0 | 写真 + 135deg グラデーション覆い |
| hero-grain | 1 | SVG turbulence ノイズ (opacity 4%) |
| hero-halftone | 2 | セージグリーンのドット + 右下フェードマスク |
| hero-in | 3 | テキスト + 検索ボックス |

写真グラデーション覆い:
```css
background: linear-gradient(135deg,
  rgba(247,245,239, .92) 0%,    /* 左上: ほぼ不透明 → テキスト可読 */
  rgba(247,245,239, .82) 40%,
  rgba(247,245,239, .50) 70%,
  rgba(247,245,239, .30) 100%   /* 右下: 半透明 → 写真が見える */
);
```

### 5.3 検索ボックス

- 背景: `--card` (白)
- 角丸: `--r` (10px)
- 影: `--shadow-l`
- 入力フィールド: `--warm` 背景 / `--warm-2` ボーダー / focus → `--sage` ボーダー + ring
- 検索ボタン: `--sage` 背景 / 6px角丸
- 人気タグ: `--warm` 背景 / hover → `--sage-light` 背景

### 5.4 物件カード

- 角丸: 10px
- 影: 通常 `--shadow-s` / hover `--shadow-h`
- hover: `translateY(-4px)` + 写真 `scale(1.05)`
- 写真高さ: 200px固定 / object-fit: cover
- 写真下部: `linear-gradient(0deg, rgba(0,0,0,.18) 0%, transparent 40%)`
- バッジ: 左上に配置、5px角丸、solid背景
- お気に入り: 右上に配置、円形、glass背景（backdrop-filter: blur）
- 面積表示: 右下に配置、glass背景
- 価格: 19px / 700 / `--sage-deep`
- スペックタグ: `--warm` 背景 / 5px角丸 / 10px
- 区切り: `--warm-2` の border-top
- stagger animation: 各カード 0.06s ずつ遅延

### 5.5 特徴カード

- 4列グリッド（900px以下で2列、600px以下で1列）
- アイコン: 36×36px、`--sage-light` 背景、8px角丸、Lucide 20px
- hover: `translateY(-2px)` + `--shadow-m`

### 5.6 ボタン

| 種類 | 背景 | テキスト | 角丸 | 用途 |
|------|------|---------|------|------|
| Primary | `--sage` | #fff | 6px | 検索ボタン |
| Primary Pill | `--sage` | #fff | 20px | ナビCTA |
| CTA Large | `--sage` | #fff | 24px | CTAセクション |
| Sort (通常) | `--card` + border `--warm-2` | `--bark-3` | 16px | ソートボタン |
| Sort (選択) | `--sage-xlight` + border `--sage` | `--sage` | 16px | ソートボタン選択中 |
| Tag | `--warm` | `--bark-3` | 10px | 検索タグ |
| Tag (hover) | `--sage-light` | `--sage-deep` | 10px | 検索タグホバー |
| Favorite | rgba(255,255,255,.85) | — | 50% | お気に入りボタン |

hover共通: `transform: translateY(-1px)` + `box-shadow`

### 5.7 CTAセクション

- 背景: 写真 + ダーク覆い（左85%→右40%の透過グラデーション）
- 質感: Halftone Bottom Rise (白ドット、下40%でフェード)
- テキスト色: 白、強調部分は `--sage-light`
- CTAボタン: `--sage` 背景、pill形（24px角丸）

### 5.8 フッター

- 背景: `--bark` (#2a2a2a)
- 質感: Halftone Top Edge（暖白ドット、上25%でフェード）
- リンク色: `rgba(247,245,239, .5)` / hover → `--warm`
- カラムヘッダー: 10px / 700 / uppercase / `--bark-4`
- コピーライト: `--mono` / 10px / `--bark-4`

---

## 6. アニメーション

### 方針

- **初回表示**: `fadeUp`（下から16px + フェードイン）を基本とする。ページロード時にコンテンツが自然に現れる演出
- **stagger**: リスト要素（物件カード等）は 0.06〜0.08s ずつ遅延させて順番に出す
- **hover**: `translateY` による微小な浮き上がり + shadow の強化。カードは -4px、小要素は -1〜-2px
- **写真 hover**: `scale(1.05)` でゆっくり寄る。overflow: hidden でフレームからはみ出さない
- **duration の目安**: 初回表示 0.5〜0.8s / hover 0.2〜0.35s。0.4s を超えるインタラクションは重く感じるので避ける
- **easing**: `ease` を基本とする。バウンスやスプリングは使わない

---

## 7. アイコン

`lucide-react` を使用。絵文字は使わない。

```bash
npm install lucide-react
```

| 用途 | アイコン名 |
|------|-----------|
| エリア | `MapPin` |
| 一戸建て | `Home` |
| マンション | `Building2` |
| 土地 | `MapPin` |
| 入札 | `Gavel` |
| 士業 | `Briefcase` |
| スピード | `Clock` |
| セキュリティ | `ShieldCheck` |
| お気に入り | `Heart` (outline / fill で状態切替) |
| 成約 | `CheckCircle` |
| 差戻し | `AlertCircle` |
| 書類 | `FileText` |
| 通知 | `Bell` |
| 業者 | `Handshake` |
| 収益 | `DollarSign` |
| 検索 | `Search` |
| フィルター | `SlidersHorizontal` |
| 設定 | `Settings` |

アイコンサイズ:
| 用途 | サイズ | stroke-width |
|------|--------|-------------|
| 特徴カードアイコン | 20px（36×36の背景内） | 1.5 |
| カード内インライン | 14px | 1.5 |
| ナビ・ボタン内 | 16px | 2 |
| バッジ横 | 12px | 2 |

---

## 8. 写真の扱い

### 8.1 物件カード写真

| 項目 | 値 |
|------|-----|
| アスペクト比 | 自由（高さ 200px 固定） |
| object-fit | cover |
| 下部グラデーション | `linear-gradient(0deg, rgba(0,0,0,.18) 0%, transparent 40%)` |
| hover | `scale(1.05)` / 0.5s ease |
| 写真なし時 | `--warm` 背景 + 建物アイコン（未実装。Phase 2） |

### 8.2 ヒーロー背景写真

| 項目 | 値 |
|------|-----|
| object-fit | cover |
| object-position | center 40% |
| 覆いグラデーション | 135deg、左上 92% → 右下 30% の透過 |
| 目的 | 左側のテキスト可読性を確保しつつ右側に写真を見せる |

### 8.3 CTA背景写真

| 項目 | 値 |
|------|-----|
| object-fit | cover |
| object-position | center 60% |
| 覆いグラデーション | 90deg、左 85% → 右 40% のダーク覆い |

---

## 9. ダークモード

Phase 1 では対応しない。CSS変数ベースで設計済みのため、将来 `prefers-color-scheme: dark` での切り替えは可能。

フッター（`--bark` 背景）が事実上のダークセクションとして機能しており、ダーク上でのテキスト色・Halftone の設定が先行実装されている。


