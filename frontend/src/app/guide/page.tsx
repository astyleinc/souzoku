'use client'

import {
  Upload,
  Gavel,
  Handshake,
  CheckCircle,
  ArrowRight,
  Search,
  FileText,
  Users,
  Link2,
  Building2,
  Briefcase,
} from 'lucide-react'
import Link from 'next/link'

const sellerSteps = [
  { icon: Upload, title: '物件を登録', description: '相続した不動産の情報と必要書類をアップロードします。士業パートナーの代理登録も可能です。' },
  { icon: FileText, title: '審査・公開', description: 'Ouver運営が物件情報を審査し、問題なければ公開されます。登記手続き中の物件も条件付きで公開可能です。' },
  { icon: Gavel, title: '入札を受ける', description: '設定した入札期間中に、不動産会社や個人から入札を受け付けます。入札状況はリアルタイムで確認できます。' },
  { icon: Handshake, title: '入札者を選択', description: '入札終了後、条件を比較して最適な買い手を選びます。価格だけでなく取引条件も確認できます。' },
  { icon: CheckCircle, title: '成約・決済', description: '提携の宅建業者が仲介手続きを進めます。契約締結から決済完了まで、進捗をダッシュボードで確認できます。' },
]

const buyerSteps = [
  { icon: Search, title: '物件を探す', description: 'エリア・価格・種別で相続不動産を検索。お気に入り登録で新着通知も受け取れます。' },
  { icon: Gavel, title: '入札する', description: '気になる物件に希望金額で入札します。入札期間中なら何度でも金額を更新できます。' },
  { icon: Handshake, title: '選定・成約', description: '売主に選ばれると、提携業者を通じて売買手続きが進みます。ダッシュボードで進捗を確認できます。' },
]

const professionalSteps = [
  { icon: Link2, title: '紹介リンクを発行', description: '相続相談を受けたクライアントに専用の紹介リンクを共有します。代理登録も可能です。' },
  { icon: Users, title: '案件を見守る', description: '紹介したクライアントの物件ステータスをダッシュボードで確認できます。' },
  { icon: CheckCircle, title: '紹介料を受け取る', description: '成約時に仲介手数料の15%が紹介料として支払われます。' },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary-500 tracking-tight">
            Ouver
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/contact" className="text-neutral-500 hover:text-neutral-700 transition-colors">
              お問い合わせ
            </Link>
            <Link href="/login" className="text-neutral-500 hover:text-neutral-700 transition-colors">
              ログイン
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">ご利用の流れ</h1>
        <p className="text-sm text-neutral-400 mb-10">
          Ouverは相続不動産に特化した入札型マッチングプラットフォームです。あなたの立場に合わせた利用方法をご確認ください。
        </p>

        {/* 売主 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-500" />
            </div>
            <h2 className="text-lg font-semibold">売主（相続人）の方</h2>
          </div>
          <div className="space-y-0">
            {sellerSteps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-card flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  {i < sellerSteps.length - 1 && (
                    <div className="w-px flex-1 bg-neutral-200 my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 font-medium">STEP {i + 1}</span>
                  </div>
                  <h3 className="text-sm font-semibold mt-0.5">{step.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
          >
            売主として登録
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* 買い手 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-info-50 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-info-500" />
            </div>
            <h2 className="text-lg font-semibold">買い手の方</h2>
          </div>
          <div className="space-y-0">
            {buyerSteps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-card flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-info-500" />
                  </div>
                  {i < buyerSteps.length - 1 && (
                    <div className="w-px flex-1 bg-neutral-200 my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <span className="text-xs text-neutral-400 font-medium">STEP {i + 1}</span>
                  <h3 className="text-sm font-semibold mt-0.5">{step.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
          >
            買い手として登録
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* 士業パートナー */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-secondary-50 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-secondary-500" />
            </div>
            <h2 className="text-lg font-semibold">士業パートナーの方</h2>
          </div>
          <div className="space-y-0">
            {professionalSteps.map((step, i) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-card flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-secondary-500" />
                  </div>
                  {i < professionalSteps.length - 1 && (
                    <div className="w-px flex-1 bg-neutral-200 my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <span className="text-xs text-neutral-400 font-medium">STEP {i + 1}</span>
                  <h3 className="text-sm font-semibold mt-0.5">{step.title}</h3>
                  <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary-500 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
          >
            パートナー登録について問い合わせ
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* よくある質問 */}
        <section>
          <h2 className="text-lg font-semibold mb-4">よくある質問</h2>
          <div className="space-y-3">
            {[
              { q: '利用料金はかかりますか？', a: '物件の掲載・入札は無料です。成約時に仲介手数料が発生しますが、これは一般的な不動産取引と同じ水準です。' },
              { q: '相続登記が完了していなくても掲載できますか？', a: 'はい。登記手続き中の物件は「公開（登記中）」として条件付きで掲載できます。ただし2ヶ月以内に登記完了が必要です。' },
              { q: '入札した金額は他の入札者に見えますか？', a: 'いいえ。入札金額は売主のみに表示されます。入札件数は公開されますが、各入札者の金額は非公開です。' },
              { q: '士業パートナーの紹介料はどのように計算されますか？', a: '成約時の仲介手数料の15%が紹介料として支払われます。NW経由の紹介の場合、NW手数料3%が別途差し引かれます。' },
            ].map((faq) => (
              <details key={faq.q} className="bg-white rounded-2xl shadow-card group">
                <summary className="px-5 py-4 text-sm font-medium cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 text-neutral-300 transition-transform group-open:rotate-90 shrink-0 ml-3" />
                </summary>
                <div className="px-5 pb-4 text-sm text-neutral-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t border-neutral-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <p>&copy; 2026 株式会社Ouver</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-neutral-600 transition-colors">利用規約</Link>
            <Link href="/privacy" className="hover:text-neutral-600 transition-colors">プライバシーポリシー</Link>
            <Link href="/contact" className="hover:text-neutral-600 transition-colors">お問い合わせ</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
