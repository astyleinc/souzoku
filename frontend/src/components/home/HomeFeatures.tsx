/**
 * 4特徴ブロック
 *
 * テイスト統一ルール:
 * - 線: stroke=#4a6a50 (sage-deep) / 1.8px / round
 * - 塗り: 内側は #f7f5ef (warm)、強調アクセントのみ #6b8f71 (sage)
 * - 赤や他色を入れない（NoCallArtも sage のみで表現）
 * - 装飾パターン（ドット背景など）はSVG内部には入れない。
 *   背景質感はカード側の bg-sage-xlight に任せる。
 * - 小さなテキストタグは使うなら太字・sage-deg塗りで統一
 *
 * レイアウトの非対称性:
 * - 主役カード（col-span-7）: 左にイラスト帯 + 右にテキスト+数値
 * - サブカード（col-span-5）: 3枚を縦積み、内部は「SVG左 + テキスト右」で揃える。
 *   非対称は「左の大きい1枚 vs 右の小さい3枚」で取り、サブ同士は均質に保つ。
 */

const STROKE = '#4a6a50'
const ACCENT = '#6b8f71'
const FILL = '#f7f5ef'
const LINE = '#aaaaaa'

/* ============================================
   AuctionArt — 競争入札で価格が上がる
   ============================================ */
const AuctionArt = () => (
  <svg viewBox="0 0 200 140" className="w-full h-auto max-w-[220px]" aria-hidden>
    {/* 基準線 */}
    <line x1="22" y1="118" x2="178" y2="118" stroke={LINE} strokeWidth="1" />

    {/* 4本の入札バー（昇順） */}
    <g fill={FILL} stroke={STROKE} strokeWidth="1.8" strokeLinejoin="round">
      <rect x="36" y="96" width="18" height="22" rx="2" />
      <rect x="66" y="80" width="18" height="38" rx="2" />
      <rect x="96" y="60" width="18" height="58" rx="2" />
    </g>
    {/* 成約バーは塗りを効かせる */}
    <rect
      x="126"
      y="38"
      width="22"
      height="80"
      rx="2"
      fill={ACCENT}
      stroke={STROKE}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    {/* 成約バーの上タグ */}
    <g transform="translate(129 20)">
      <rect width="34" height="14" rx="3" fill={STROKE} />
      <text
        x="17"
        y="10"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill={FILL}
        fontFamily="ui-sans-serif, system-ui"
        letterSpacing="0.06em"
      >
        成約
      </text>
    </g>

    {/* 上昇ライン（実線、手描き感） */}
    <path
      d="M30 104 Q 72 94, 100 72 Q 128 52, 156 30"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* 矢じり */}
    <path
      d="M149 26 L160 28 L156 39"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* 入札を示す小さな点 */}
    <g fill={ACCENT}>
      <circle cx="45" cy="88" r="2.5" />
      <circle cx="75" cy="72" r="2.5" />
      <circle cx="105" cy="54" r="2.5" />
    </g>
  </svg>
)

/* ============================================
   NetworkArt — 士業ネットワーク
   ============================================ */
const NetworkArt = () => (
  <svg viewBox="0 0 96 96" className="w-16 h-16 shrink-0" aria-hidden>
    {/* 基準線 */}
    <line x1="14" y1="84" x2="82" y2="84" stroke={LINE} strokeWidth="1" />

    {/* 繋ぎ線 */}
    <g stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round">
      <line x1="24" y1="62" x2="48" y2="26" />
      <line x1="48" y1="26" x2="72" y2="62" />
      <line x1="24" y1="62" x2="72" y2="62" strokeDasharray="3 3" />
    </g>

    {/* ノード3つ — すべて同じスタイル（warm塗り + sage-deep線） */}
    <g fill={FILL} stroke={STROKE} strokeWidth="1.8">
      <circle cx="48" cy="26" r="12" />
      <circle cx="24" cy="62" r="10" />
      <circle cx="72" cy="62" r="10" />
    </g>

    {/* ノード内の役割ラベル */}
    <g
      fill={STROKE}
      fontSize="10"
      fontWeight="700"
      textAnchor="middle"
      fontFamily="ui-sans-serif, system-ui"
    >
      <text x="48" y="30">税</text>
      <text x="24" y="66">司</text>
      <text x="72" y="66">弁</text>
    </g>
  </svg>
)

/* ============================================
   StopwatchArt — スピード売却
   ============================================ */
const StopwatchArt = () => (
  <svg viewBox="0 0 96 96" className="w-16 h-16 shrink-0" aria-hidden>
    {/* 基準線 */}
    <line x1="14" y1="84" x2="82" y2="84" stroke={LINE} strokeWidth="1" />

    {/* クラウン */}
    <rect x="44" y="14" width="8" height="5" rx="1.2" fill={STROKE} />
    <line
      x1="38"
      y1="20"
      x2="58"
      y2="20"
      stroke={STROKE}
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* 文字盤 */}
    <circle
      cx="48"
      cy="52"
      r="24"
      fill={FILL}
      stroke={STROKE}
      strokeWidth="1.8"
    />

    {/* 目盛り */}
    <g stroke={STROKE} strokeWidth="1.8" strokeLinecap="round">
      <line x1="48" y1="30" x2="48" y2="33" />
      <line x1="70" y1="52" x2="67" y2="52" />
      <line x1="48" y1="74" x2="48" y2="71" />
      <line x1="26" y1="52" x2="29" y2="52" />
    </g>

    {/* 針 — 短時間で到達を示す位置（約1時） */}
    <line
      x1="48"
      y1="52"
      x2="58"
      y2="40"
      stroke={STROKE}
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* 中心ピン */}
    <circle cx="48" cy="52" r="2" fill={ACCENT} />
  </svg>
)

/* ============================================
   MuteBellArt — 営業電話/DMなし
   ベル + 斜線（red不使用、sage-deep のみ）
   ============================================ */
const MuteBellArt = () => (
  <svg viewBox="0 0 96 96" className="w-16 h-16 shrink-0" aria-hidden>
    {/* 基準線 */}
    <line x1="14" y1="84" x2="82" y2="84" stroke={LINE} strokeWidth="1" />

    {/* ベル本体 */}
    <g fill={FILL} stroke={STROKE} strokeWidth="1.8" strokeLinejoin="round">
      <path d="M48 20 C 34 20, 30 30, 30 42 C 30 52, 26 58, 24 62 L 72 62 C 70 58, 66 52, 66 42 C 66 30, 62 20, 48 20 Z" />
      {/* ベルのつまみ */}
      <path d="M45 20 L 45 16 L 51 16 L 51 20" fill="none" />
      {/* 下の振り子 */}
      <path d="M43 62 C 43 66, 45 68, 48 68 C 51 68, 53 66, 53 62" />
    </g>

    {/* ミュート斜線（太め+影の錯視用に2本ではなく1本で潔く） */}
    <line
      x1="22"
      y1="22"
      x2="74"
      y2="74"
      stroke={FILL}
      strokeWidth="5"
      strokeLinecap="round"
    />
    <line
      x1="22"
      y1="22"
      x2="74"
      y2="74"
      stroke={STROKE}
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* 斜線の終端アクセント */}
    <circle cx="22" cy="22" r="2.5" fill={STROKE} />
    <circle cx="74" cy="74" r="2.5" fill={ACCENT} />
  </svg>
)

/* ============================================
   Section
   ============================================ */

const SubCard = ({
  art,
  title,
  body,
}: {
  art: React.ReactNode
  title: string
  body: string
}) => (
  <article className="surface-card-soft rounded-[14px] p-5 flex items-start gap-4 transition-[transform] duration-300 hover:-translate-y-0.5">
    {art}
    <div className="flex-1 min-w-0">
      <h3 className="text-[14px] font-bold text-bark mb-1 tracking-[-0.01em]">
        {title}
      </h3>
      <p className="text-[12px] text-bark-3 leading-[1.65]">{body}</p>
    </div>
  </article>
)

export const HomeFeatures = () => (
  <section id="features" className="max-w-[1260px] mx-auto px-5 md:px-9 pb-20 scroll-mt-20">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* 主役カード */}
      <article className="lg:col-span-7 surface-card-feature rounded-[16px] flex flex-col sm:flex-row">
        <div className="flex items-center justify-center p-6 sm:w-[46%] sm:min-h-[240px]">
          <AuctionArt />
        </div>
        <div className="p-6 sm:p-7 flex flex-col justify-center">
          <p className="text-[10px] font-bold text-sage-deep tracking-[0.08em] uppercase mb-1.5">
            コア機能
          </p>
          <h3 className="text-[17px] sm:text-[19px] font-bold tracking-[-0.02em] text-bark mb-2 leading-[1.4]">
            入札で、査定任せにしない価格を。
          </h3>
          <p className="text-[13px] text-bark-3 leading-[1.7]">
            複数の買い手が同じ条件で競う設計。売主が希望価格を設定し、買取業者の一方的な査定ではなく、市場が値段を決めます。
          </p>
          <dl className="mt-5 flex gap-7">
            <div>
              <dt className="text-[10px] text-bark-4 tracking-[0.05em]">
                平均入札数
              </dt>
              <dd className="price text-[22px] text-sage-deep leading-none mt-1">
                4.2
                <span className="text-[11px] font-normal text-bark-4 ml-1">
                  件
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[10px] text-bark-4 tracking-[0.05em]">
                希望価格達成率
              </dt>
              <dd className="price text-[22px] text-sage-deep leading-none mt-1">
                92
                <span className="text-[11px] font-normal text-bark-4 ml-1">
                  %
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </article>

      {/* サブ3カード — 内部レイアウトを揃え、テイストの統一を優先 */}
      <div className="lg:col-span-5 grid grid-cols-1 gap-4">
        <SubCard
          art={<NetworkArt />}
          title="士業ネットワーク"
          body="税理士・司法書士・弁護士と連携。相続手続きをワンストップで。"
        />
        <SubCard
          art={<StopwatchArt />}
          title="スピード売却"
          body="入札期限は2〜4週間。申告期限10ヶ月に間に合わせる設計。"
        />
        <SubCard
          art={<MuteBellArt />}
          title="営業電話なし"
          body="やりとりはすべてプラットフォーム経由。不要な電話やDMは届きません。"
        />
      </div>
    </div>
  </section>
)
