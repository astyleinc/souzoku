import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* ブランド（控えめ） */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm leading-relaxed max-w-xs">
              相続不動産の売却を、入札方式で適正価格・短期間に。
            </p>
          </div>

          {/* サービス */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4">サービス</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#features" className="hover:text-white transition-colors">サービスの特長</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">ご利用の流れ</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">新規登録</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">ログイン</Link></li>
            </ul>
          </div>

          {/* 物件種別 */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4">物件種別</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/properties?type=house" className="hover:text-white transition-colors">一戸建て</Link></li>
              <li><Link href="/properties?type=land" className="hover:text-white transition-colors">土地</Link></li>
              <li><Link href="/properties?type=apartment" className="hover:text-white transition-colors">マンション</Link></li>
              <li><Link href="/properties?type=other" className="hover:text-white transition-colors">その他</Link></li>
            </ul>
          </div>

          {/* エリア */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-4">対応エリア</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/properties?prefecture=東京都" className="hover:text-white transition-colors">東京都</Link></li>
              <li><Link href="/properties?prefecture=神奈川県" className="hover:text-white transition-colors">神奈川県</Link></li>
              <li className="text-neutral-500 text-xs pt-1">※ Phase 2で首都圏全域に拡大予定</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
          <span>&copy; 2026 株式会社Ouver</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">プライバシーポリシー</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
