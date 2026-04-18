import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: '料金について｜Ouver',
  description:
    '掲載も入札も無料。費用は成約時の仲介手数料だけ。売主・買い手・士業パートナーの料金と、計算例をまとめました。',
}

const STEPS = [
  {
    step: '01',
    phase: '登録',
    note: 'アカウント作成・パートナー登録・紹介リンク発行',
    type: 'free' as const,
    amount: '¥0',
  },
  {
    step: '02',
    phase: '掲載・入札',
    note: '物件掲載・写真登録・入札受付・キャンセル・再掲載',
    type: 'free' as const,
    amount: '¥0',
  },
  {
    step: '03',
    phase: '成約',
    note: '仲介手数料のみ（税別・宅建業法の上限内）',
    type: 'paid' as const,
    amount: '仲介手数料のみ',
  },
]

const MATRIX = [
  {
    role: '売主',
    eyebrow: 'SELLER',
    register: '無料',
    list: '無料',
    close: '売買価格 × 3% + 6万円',
    closeNote: '成約時のみ発生',
  },
  {
    role: '買い手',
    eyebrow: 'BUYER',
    register: '無料',
    list: '無料',
    close: '売買価格 × 3% + 6万円',
    closeNote: '成約時のみ発生',
  },
  {
    role: '士業パートナー',
    eyebrow: 'PROFESSIONAL',
    register: '無料',
    list: '—',
    close: '仲介手数料の15%を受領',
    closeNote: '支払いではなく、成約時の収入',
  },
]

const FREE_GROUPS = [
  {
    title: '売主・買い手',
    items: ['物件の登録・公開・写真掲載', '入札の受付・キャンセル・再掲載', '買い手の検索・閲覧・問い合わせ'],
  },
  {
    title: 'パートナー',
    items: ['士業パートナー登録', '紹介リンクの発行', '代理登録の利用'],
  },
  {
    title: '共通機能',
    items: ['メッセージ・通知', '書類共有・ダウンロード', 'ダッシュボード・案件管理'],
  },
]

const PILLARS = [
  {
    step: '01',
    title: '成約したときだけ収益',
    lead: '売れなければ、誰も損をしない',
    body: '掲載や入札で費用をいただく理由はありません。Ouverの収益は、成約時の仲介手数料を提携宅建業者と分け合ったもの。売れなければ、運営にも収益は入りません。',
  },
  {
    step: '02',
    title: '配分は全部オープン',
    lead: '誰にいくら渡るかを公開',
    body: '仲介手数料は、提携宅建業者・Ouver・士業・NWの4者で配分します。士業への紹介料（15%）もこの中から支払うので、売主・買い手への追加請求はありません。',
  },
  {
    step: '03',
    title: '法定上限を超えない',
    lead: '独自の上乗せや隠れた費用はなし',
    body: '仲介手数料は、宅地建物取引業法の上限（売買価格 × 3% + 6万円）の範囲内です。成約後に追加で請求したり、期間延長で別料金をいただくこともありません。',
  },
]

const CALC_ROWS = [
  { price: 2000, fee: 66, toBroker: 33, toOuver: 21.18, referral: 9.9 },
  { price: 3000, fee: 96, toBroker: 48, toOuver: 30.8, referral: 14.4 },
  { price: 5000, fee: 156, toBroker: 78, toOuver: 50.05, referral: 23.4 },
  { price: 8000, fee: 246, toBroker: 123, toOuver: 78.93, referral: 36.9 },
]

const COMPARE = [
  { label: '掲載費用', ouver: '無料', general: '無料〜有料（会社による）' },
  { label: '価格決定の方法', ouver: '入札（市場価格）', general: '業者査定による提示' },
  { label: '売却までの期間', ouver: '入札期間 + 手続き', general: '3〜6ヶ月が一般的' },
  { label: '仲介手数料の上限', ouver: '法定上限内', general: '法定上限内' },
  { label: '士業サポート', ouver: '提携NWから紹介', general: '売主が自分で探す' },
  { label: '入札件数の公開', ouver: '公開', general: '非公開が一般的' },
  { label: '仲介手数料の内訳', ouver: '公開', general: '非公開が一般的' },
]

const FAQ = [
  {
    q: '本当に掲載料はかからないの？',
    a: 'はい。物件の掲載も、入札の受付も参加も、すべて無料です。費用が発生するのは成約時の仲介手数料だけ。前払いや月額費用はいただきません。',
  },
  {
    q: '入札を途中でキャンセルしたら費用はかかりますか？',
    a: 'かかりません。入札期間中のキャンセルは何度でも無料です。売主が入札者を選ばなかった場合も、費用は発生しません。',
  },
  {
    q: '士業紹介料は売主の負担になりますか？',
    a: 'なりません。紹介料は仲介手数料の中から配分するので、売主・買い手への追加請求はありません。仲介手数料そのものも、宅建業法の上限内で固定です。',
  },
  {
    q: '仲介手数料はいつ支払うの？',
    a: '決済の完了時に、提携宅建業者を通じてお支払いいただきます。契約時の前払いはありません。',
  },
  {
    q: '両手仲介の場合、手数料は合算されますか？',
    a: '売主・買い手のそれぞれから仲介手数料をいただくので、運営側での総額は2倍になります。ただし、お一人が支払う金額は片手仲介と同じ「売買価格 × 3% + 6万円」です。',
  },
  {
    q: '成約しなかった場合はどうなりますか？',
    a: '費用は発生しません。入札期間中のキャンセルも、買い手を選ばなかった場合も、再出品に切り替えた場合も、費用はいただきません。',
  },
]

export default function PricingPage() {
  return (
    <div className="bg-warm min-h-screen">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="relative max-w-[1260px] mx-auto px-5 md:px-9 pt-14 md:pt-20 pb-14 md:pb-20 grid md:grid-cols-[1fr_1fr] gap-8 md:gap-14 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6 text-[12px] tracking-[0.32em] font-semibold text-sage-deep">
                <span aria-hidden className="block w-8 h-px bg-sage-deep/50" />
                PRICING
              </div>
              <h1 className="font-bold text-[clamp(38px,5.6vw,64px)] leading-[1.12] tracking-[-0.03em] text-bark mb-6 [word-break:keep-all]">
                掲載も入札も、
                <br />
                費用はゼロ円。
                <br />
                成約時だけ、
                <span className="text-sage-deep">法定上限内</span>の手数料。
              </h1>
              <p className="text-[17px] text-bark-2 leading-[1.95] max-w-[560px] mb-6 font-medium">
                月額費用も前払いもありません。士業への紹介料やNW手数料は、仲介手数料の中から配分するので、売主・買い手に追加の負担はありません。
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-bark font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-deep" aria-hidden />
                  月額0円
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-deep" aria-hidden />
                  前払いなし
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-deep" aria-hidden />
                  キャンセル無料
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-deep" aria-hidden />
                  宅建業法上限内
                </div>
              </div>
            </div>

            {/* Cost Flow — 大型化 */}
            <div className="relative">
              <div className="flex items-baseline justify-between mb-5">
                <div className="text-[12px] tracking-[0.32em] font-semibold text-bark-4">
                  COST FLOW
                </div>
                <div className="text-[11px] text-bark-3">費用発生のタイミング</div>
              </div>
              <ol className="relative space-y-3">
                {STEPS.map((s, i) => (
                  <li
                    key={s.step}
                    className={`relative grid grid-cols-[auto_1fr_auto] items-center gap-5 px-6 py-6 rounded-[14px] ${
                      s.type === 'paid'
                        ? 'bg-bark text-warm shadow-[0_18px_42px_-20px_rgba(20,28,24,0.45)]'
                        : 'bg-white border border-black/5'
                    }`}
                  >
                    <span
                      className={`text-[13px] tracking-[0.2em] font-bold ${
                        s.type === 'paid' ? 'text-sage' : 'text-sage-deep'
                      }`}
                    >
                      {s.step}
                    </span>
                    <div>
                      <div
                        className={`text-[20px] font-bold tracking-[-0.015em] leading-[1.25] mb-1 ${
                          s.type === 'paid' ? 'text-warm' : 'text-bark'
                        }`}
                      >
                        {s.phase}
                      </div>
                      <div
                        className={`text-[12px] leading-[1.65] ${
                          s.type === 'paid' ? 'text-warm-2/90' : 'text-bark-3'
                        }`}
                      >
                        {s.note}
                      </div>
                    </div>
                    <div className="text-right">
                      {s.type === 'free' ? (
                        <div className="price text-[32px] font-bold text-bark leading-none">
                          <span className="text-[15px] align-top mr-0.5">¥</span>
                          0
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="price text-[22px] font-bold text-warm leading-none whitespace-nowrap">
                            3% + 6万円
                          </div>
                          <div className="text-[11px] text-warm-2/80 mt-1.5 tracking-[0.04em]">
                            税別／法定上限内
                          </div>
                        </div>
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[38px] -bottom-3 w-px h-3 bg-bark/25"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* STATEMENT STRIP — ダーク bark で視覚を締める */}
        <section className="relative overflow-hidden bg-bark text-warm">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(247,245,239,0.9) 1px, transparent 1.4px)',
              backgroundSize: '18px 18px',
            }}
          />
          <div className="relative max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12 items-center">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage mb-5">
                WHY FREE
              </div>
              <p className="text-[clamp(22px,2.6vw,32px)] font-bold tracking-[-0.02em] leading-[1.6] text-warm">
                Ouverの収益は、成約したときの仲介手数料だけ。
                <br />
                <span className="text-warm-2/80">だから、売れるまで費用はいただきません。</span>
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {[
                { n: '0', unit: '円', label: '月額費用' },
                { n: '0', unit: '円', label: '前払金' },
                { n: '0', unit: '円', label: '再出品料' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="border-l border-warm-2/20 pl-4 md:pl-5"
                >
                  <div className="price text-[44px] md:text-[56px] font-bold text-warm leading-none">
                    {s.n}
                    <span className="text-[16px] font-medium text-warm-2/80 ml-1">{s.unit}</span>
                  </div>
                  <div className="text-[12px] text-warm-2/70 mt-2 tracking-[0.08em]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MATRIX */}
        <section>
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div className="max-w-[640px]">
                <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                  WHO PAYS WHAT
                </div>
                <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                  立場ごとの料金
                </h2>
                <p className="text-[15px] text-bark-2 leading-[1.9]">
                  登録から成約まで、どの立場に・いつ費用が発生するかを一覧にまとめました。
                </p>
              </div>
              <p className="text-[11px] text-bark-4 leading-[1.8] max-w-[240px]">
                ※ 金額は税別、仲介手数料の片手分。両手仲介では運営側の総額が2倍になります。
              </p>
            </div>

            <div className="surface-card rounded-[14px] overflow-hidden">
              <div className="hidden md:grid grid-cols-[1.3fr_0.7fr_0.7fr_1.6fr] text-[11px] tracking-[0.2em] font-semibold uppercase border-b border-bark/10 bg-warm/60">
                <div className="py-4 px-6 text-bark-4">立場</div>
                <div className="py-4 px-6 text-bark-4">登録</div>
                <div className="py-4 px-6 text-bark-4">掲載・入札</div>
                <div className="py-4 px-6 text-sage-deep bg-sage-xlight/60">成約時</div>
              </div>
              {MATRIX.map((row, i) => (
                <div
                  key={row.role}
                  className={`grid md:grid-cols-[1.3fr_0.7fr_0.7fr_1.6fr] gap-y-3 md:gap-y-0 py-6 md:py-0 px-5 md:px-0 ${
                    i < MATRIX.length - 1 ? 'border-b border-black/5' : ''
                  }`}
                >
                  <div className="md:py-6 md:px-6">
                    <div className="text-[11px] tracking-[0.28em] font-semibold text-sage-deep mb-1.5">
                      {row.eyebrow}
                    </div>
                    <div className="text-[20px] font-bold text-bark tracking-[-0.015em]">
                      {row.role}
                    </div>
                  </div>
                  <div className="md:py-6 md:px-6 flex md:block items-center gap-3">
                    <span className="md:hidden text-[10px] tracking-[0.2em] text-bark-4 font-semibold uppercase w-[90px]">
                      登録
                    </span>
                    <span className="price text-[18px] font-bold text-bark">{row.register}</span>
                  </div>
                  <div className="md:py-6 md:px-6 flex md:block items-center gap-3">
                    <span className="md:hidden text-[10px] tracking-[0.2em] text-bark-4 font-semibold uppercase w-[90px]">
                      掲載・入札
                    </span>
                    <span className="price text-[18px] font-bold text-bark">{row.list}</span>
                  </div>
                  <div className="md:py-6 md:px-6 flex md:block items-start gap-3 bg-sage-xlight/60">
                    <span className="md:hidden text-[10px] tracking-[0.2em] text-bark-4 font-semibold uppercase w-[90px] shrink-0 mt-0.5">
                      成約時
                    </span>
                    <div>
                      <div className="text-[16px] text-bark font-bold leading-[1.5]">
                        {row.close}
                      </div>
                      <div className="text-[11px] text-bark-3 mt-1">{row.closeNote}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ALL FREE — 3カテゴリ分けで密度を上げる */}
        <section className="border-t border-black/5 bg-sage-xlight/40">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10 md:mb-12">
              <div className="max-w-[640px]">
                <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                  ALL FREE
                </div>
                <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                  これもすべて、ずっと無料
                </h2>
                <p className="text-[15px] text-bark-2 leading-[1.9]">
                  有料プランやオプションは用意していません。下にある機能はすべて、登録後すぐに、成約まで何度でも無料でお使いいただけます。
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {FREE_GROUPS.map((g) => (
                <div
                  key={g.title}
                  className="surface-card rounded-[14px] p-7 md:p-8"
                >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <h3 className="text-[18px] font-bold text-bark tracking-[-0.01em]">
                      {g.title}
                    </h3>
                    <span className="text-[11px] font-bold tracking-[0.16em] text-sage-deep px-2 py-1 bg-sage-xlight rounded-[4px]">
                      ¥0
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {g.items.map((item) => (
                      <li key={item} className="flex gap-3 text-[14px] text-bark-2 leading-[1.7]">
                        <span
                          aria-hidden
                          className="mt-[10px] block w-3 h-px bg-sage-deep/70 shrink-0"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* なぜ無料か */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10 md:mb-12">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                WHY IT WORKS
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                なぜ掲載・入札が無料でも、
                <br className="hidden md:block" />
                成立するのか
              </h2>
              <p className="text-[15px] text-bark-2 leading-[1.9]">
                Ouverの収益は、成約時の仲介手数料の一部だけ。次の3つの仕組みで、売主・買い手の負担をゼロに保っています。
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {PILLARS.map((p) => (
                <article
                  key={p.step}
                  className="surface-card rounded-[14px] p-8 md:p-10 relative overflow-hidden"
                >
                  <div className="text-[13px] tracking-[0.24em] font-bold text-sage-deep mb-6">
                    {p.step}
                  </div>
                  <h3 className="text-[22px] font-bold text-bark tracking-[-0.015em] mb-3 leading-[1.35]">
                    {p.title}
                  </h3>
                  <p className="text-[13px] font-semibold text-sage-deep mb-4 tracking-[0.02em]">
                    {p.lead}
                  </p>
                  <p className="text-[14px] text-bark-2 leading-[1.95]">{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 計算例 */}
        <section className="border-t border-black/5 bg-warm">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
              <div className="max-w-[640px]">
                <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                  EXAMPLE
                </div>
                <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                  成約時の手数料と、<br className="hidden md:block" />その配分
                </h2>
                <p className="text-[15px] text-bark-2 leading-[1.9]">
                  売主・買い手が支払うのは「仲介手数料」だけ。実際の金額と、4者への配分の例をご紹介します。
                </p>
              </div>
            </div>
            <div className="surface-card rounded-[14px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[15px] min-w-[720px]">
                  <thead>
                    <tr className="border-b border-bark/10 bg-warm/60">
                      <th className="text-left py-5 px-6 text-[11px] tracking-[0.2em] text-bark-4 font-semibold uppercase">
                        売買価格
                      </th>
                      <th className="text-right py-5 px-6 text-[11px] tracking-[0.2em] text-sage-deep font-semibold uppercase bg-sage-xlight/50">
                        仲介手数料
                      </th>
                      <th className="text-right py-5 px-6 text-[11px] tracking-[0.2em] text-bark-4 font-semibold uppercase">
                        宅建業者50%
                      </th>
                      <th className="text-right py-5 px-6 text-[11px] tracking-[0.2em] text-bark-4 font-semibold uppercase">
                        Ouver32%
                      </th>
                      <th className="text-right py-5 px-6 text-[11px] tracking-[0.2em] text-bark-4 font-semibold uppercase">
                        士業15%
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CALC_ROWS.map((row, i) => (
                      <tr
                        key={row.price}
                        className={i < CALC_ROWS.length - 1 ? 'border-b border-black/5' : ''}
                      >
                        <td className="py-5 px-6 price text-[19px] text-bark font-bold">
                          {row.price.toLocaleString()}
                          <span className="text-[12px] font-normal text-bark-4 ml-1">万円</span>
                        </td>
                        <td className="py-5 px-6 price text-right text-[20px] text-bark font-bold bg-sage-xlight/50">
                          {row.fee.toLocaleString()}
                          <span className="text-[12px] font-normal text-bark-4 ml-1">万円</span>
                        </td>
                        <td className="py-5 px-6 price text-right text-[16px] text-bark-2">
                          {row.toBroker.toLocaleString()}
                          <span className="text-[12px] font-normal text-bark-4 ml-1">万円</span>
                        </td>
                        <td className="py-5 px-6 price text-right text-[16px] text-bark-2">
                          {row.toOuver.toFixed(2)}
                          <span className="text-[12px] font-normal text-bark-4 ml-1">万円</span>
                        </td>
                        <td className="py-5 px-6 price text-right text-[16px] text-bark-2">
                          {row.referral.toFixed(1)}
                          <span className="text-[12px] font-normal text-bark-4 ml-1">万円</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[12px] text-bark-4 mt-4 leading-[1.9]">
              ※ 仲介手数料は、片手仲介（売買価格 × 3% + 6万円）の金額です。両手仲介では運営側の総額が2倍になります。<br />
              ※ 配分比率は「宅建業者50% / Ouver32% / 士業15% / NW3%」のNW経由を想定した一例です。業者の実績や紹介経路により変わります。
            </p>
          </div>
        </section>

        {/* USE CASE バナー — フォト + 引用で視覚を破る */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1600&q=80&auto=format"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_55%]"
            />
            <div className="absolute inset-0 cta-gradient" />
          </div>
          <div className="relative z-[1] max-w-[1260px] mx-auto px-5 md:px-9 py-16 md:py-24 grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-14 items-center">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage mb-5">
                CASE EXAMPLE
              </div>
              <p className="text-[clamp(22px,2.8vw,30px)] font-bold tracking-[-0.02em] leading-[1.55] text-warm">
                3,000万円で成約したら、
                <br />
                売主が支払うのは
                <span className="price text-sage"> 96万円</span>
                だけ。
                <br />
                <span className="text-warm-2/85 text-[0.78em]">士業への紹介料14.4万円も、この中に含まれています。</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-warm-2/20 rounded-[12px] p-5">
                <div className="text-[11px] tracking-[0.24em] text-warm-2/80 font-semibold mb-2">
                  売主の支払い
                </div>
                <div className="price text-[32px] font-bold text-warm leading-none">
                  96<span className="text-[14px] font-medium ml-1">万円</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-warm-2/20 rounded-[12px] p-5">
                <div className="text-[11px] tracking-[0.24em] text-warm-2/80 font-semibold mb-2">
                  追加負担
                </div>
                <div className="price text-[32px] font-bold text-sage leading-none">
                  ¥0
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 比較 */}
        <section className="border-t border-black/5 bg-warm">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20">
            <div className="max-w-[720px] mb-10">
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                COMPARISON
              </div>
              <h2 className="text-[clamp(28px,3.6vw,40px)] font-bold text-bark tracking-[-0.025em] leading-[1.25] mb-4">
                一般的な仲介との違い
              </h2>
              <p className="text-[15px] text-bark-2 leading-[1.9]">
                料金だけでなく、価格の決まり方・透明性・期間のすべてで、Ouverは従来の仲介と大きく違います。
              </p>
            </div>
            <div className="surface-card rounded-[14px] overflow-hidden">
              <div className="grid grid-cols-[1fr_1fr_1fr] text-[11px] tracking-[0.2em] font-semibold uppercase border-b border-bark/10 bg-warm/60">
                <div className="py-4 px-6 text-bark-4">比較項目</div>
                <div className="py-4 px-6 text-sage-deep bg-sage-xlight/60 border-l border-sage-deep/15">
                  Ouver
                </div>
                <div className="py-4 px-6 text-bark-4">一般的な仲介</div>
              </div>
              {COMPARE.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1fr_1fr_1fr] text-[15px] ${
                    i < COMPARE.length - 1 ? 'border-b border-black/5' : ''
                  }`}
                >
                  <div className="py-5 px-6 text-bark-3 font-medium">{row.label}</div>
                  <div className="py-5 px-6 text-bark font-bold bg-sage-xlight/50 border-l border-sage-deep/10">
                    {row.ouver}
                  </div>
                  <div className="py-5 px-6 text-bark-3">{row.general}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-black/5">
          <div className="max-w-[1260px] mx-auto px-5 md:px-9 py-14 md:py-20 grid md:grid-cols-[300px_1fr] gap-10 md:gap-16">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage-deep mb-4">
                FAQ
              </div>
              <h2 className="text-[clamp(28px,3.4vw,36px)] font-bold text-bark tracking-[-0.025em] leading-[1.3] mb-4">
                料金についての
                <br />
                よくある質問
              </h2>
              <p className="text-[14px] text-bark-3 leading-[1.9]">
                この中にない質問は、
                <Link href="/contact" className="text-sage-deep underline underline-offset-[4px] decoration-sage-deep/30 ml-1">
                  お問い合わせ
                </Link>
                からお気軽にどうぞ。
              </p>
            </div>
            <div className="divide-y divide-black/8 border-y border-black/8">
              {FAQ.map((f) => (
                <details key={f.q} className="group">
                  <summary className="flex items-start justify-between gap-4 py-6 cursor-pointer list-none text-[17px] font-bold text-bark leading-[1.55] tracking-[-0.01em]">
                    <span>{f.q}</span>
                    <span
                      aria-hidden
                      className="shrink-0 text-sage-deep text-[18px] mt-1 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-6 text-[14px] text-bark-2 leading-[1.95] max-w-[720px]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — フォト背景 */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_40%]"
            />
            <div className="absolute inset-0 cta-gradient" />
          </div>
          <div className="relative z-[1] max-w-[1260px] mx-auto px-5 md:px-9 py-16 md:py-20 flex flex-wrap items-center justify-between gap-8">
            <div>
              <div className="text-[12px] tracking-[0.32em] font-semibold text-sage mb-4">
                GET STARTED
              </div>
              <h2 className="text-warm font-bold text-[clamp(22px,2.8vw,32px)] tracking-[-0.025em] leading-[1.3]">
                まずは無料で登録して、物件を見てみる
              </h2>
              <p className="text-warm-2/80 text-[14px] mt-3 max-w-[520px] leading-[1.85]">
                登録は数分で完了します。掲載も入札もキャンセルも、何度でも無料。成約まで費用はかかりません。
              </p>
            </div>
            <div className="flex items-center gap-5">
              <Link
                href="/contact"
                className="text-[13px] text-warm font-medium underline-offset-[6px] hover:underline decoration-warm/40"
              >
                料金の相談
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-bark rounded-full text-[14px] font-bold whitespace-nowrap transition-[transform,opacity] hover:opacity-95 hover:-translate-y-px"
              >
                無料で登録する
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
