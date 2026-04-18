import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="relative bg-bark text-warm-2/80 mt-auto overflow-hidden">
      {/* ハーフトーン（左上） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 footer-halftone"
      />
      {/* 細いグレイン */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 section-grain opacity-60"
      />
      {/* 上辺のsageアクセント */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage/40 to-transparent"
      />

      <div className="relative max-w-[1260px] mx-auto px-5 md:px-9 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* ブランド */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-[30px] h-[30px] bg-sage rounded-[7px] flex items-center justify-center shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <span className="text-[16px] font-bold text-warm tracking-[-0.02em]">
                Ouver
                <span
                  aria-hidden
                  className="font-serif italic font-normal text-sage text-[18px]"
                >
                  .
                </span>
              </span>
            </div>
            <p className="text-[12px] leading-[1.75] max-w-xs text-warm-2/70">
              相続不動産の売却を、入札方式で
              <br />
              適正価格・短期間に。
            </p>
          </div>

          {/* サービス */}
          <div>
            <h3 className="text-[10px] font-bold text-sage-light/80 uppercase tracking-[0.12em] mb-4">
              Service
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/#features" className="hover:text-warm transition-colors">
                  サービスの特長
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-warm transition-colors">
                  ご利用の流れ
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-warm transition-colors">
                  新規登録
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-warm transition-colors">
                  ログイン
                </Link>
              </li>
            </ul>
          </div>

          {/* 物件種別 */}
          <div>
            <h3 className="text-[10px] font-bold text-sage-light/80 uppercase tracking-[0.12em] mb-4">
              Properties
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/properties?type=house" className="hover:text-warm transition-colors">
                  一戸建て
                </Link>
              </li>
              <li>
                <Link href="/properties?type=land" className="hover:text-warm transition-colors">
                  土地
                </Link>
              </li>
              <li>
                <Link href="/properties?type=apartment" className="hover:text-warm transition-colors">
                  マンション
                </Link>
              </li>
              <li>
                <Link href="/properties?type=other" className="hover:text-warm transition-colors">
                  その他
                </Link>
              </li>
            </ul>
          </div>

          {/* エリア */}
          <div>
            <h3 className="text-[10px] font-bold text-sage-light/80 uppercase tracking-[0.12em] mb-4">
              Area
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/properties?prefecture=東京都" className="hover:text-warm transition-colors">
                  東京都
                </Link>
              </li>
              <li>
                <Link href="/properties?prefecture=神奈川県" className="hover:text-warm transition-colors">
                  神奈川県
                </Link>
              </li>
              <li className="text-warm-2/40 text-[11px] pt-1 leading-[1.5]">
                ※ Phase 2で首都圏全域に
                <br />
                拡大予定
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div>
            <h3 className="text-[10px] font-bold text-sage-light/80 uppercase tracking-[0.12em] mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 text-[13px]">
              <li>
                <Link href="/about" className="hover:text-warm transition-colors">
                  会社概要
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-warm transition-colors">
                  料金について
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-warm transition-colors">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-warm transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-warm-2/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-warm-2/50">
          <span>&copy; 2026 株式会社Ouver</span>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/terms" className="hover:text-warm-2 transition-colors">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-warm-2 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/tokusho" className="hover:text-warm-2 transition-colors">
              特定商取引法
            </Link>
            <Link href="/cookie-policy" className="hover:text-warm-2 transition-colors">
              Cookieポリシー
            </Link>
            <Link href="/accessibility" className="hover:text-warm-2 transition-colors">
              アクセシビリティ
            </Link>
            <Link href="/sitemap-page" className="hover:text-warm-2 transition-colors">
              サイトマップ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
