import {
  Shield,
  FileText,
  Handshake,
  CheckCircle,
  Building2,
  Users,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const flowSteps = [
  { icon: FileText, title: '物件登録・審査', description: 'Ouver運営が物件情報と書類を確認。問題なければ公開されます。' },
  { icon: Users, title: '入札・選定', description: '入札方式で買い手を募集。売主が条件を比較して選択します。' },
  { icon: Briefcase, title: '提携業者の仲介', description: '宅建業者が重要事項説明・契約締結を担当。専門家が間に入ります。' },
  { icon: Handshake, title: '決済・引渡し', description: '提携業者の立会いのもと、安全に決済と引渡しを完了します。' },
]

const safetyPoints = [
  { role: '売主にとって', color: 'primary', items: ['入札方式で適正価格を実現', '複数の買い手候補を比較可能', '士業パートナーのサポート付き'] },
  { role: '買い手にとって', color: 'info', items: ['物件情報は運営が審査済み', '宅建業者による重要事項説明', '入札金額は非公開で安心'] },
  { role: '士業にとって', color: 'secondary', items: ['クライアントの取引を見守れる', '成約時に紹介料を受け取れる', '提携業者が実務を代行'] },
]

const colorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-500' },
  info: { bg: 'bg-info-50', text: 'text-info-500' },
  secondary: { bg: 'bg-secondary-50', text: 'text-secondary-500' },
}

export default function EscrowPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* ヒーロー */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">安全な取引の仕組み</h1>
            <p className="text-sm text-neutral-500 max-w-xl mx-auto">
              Ouverでは、物件審査・入札方式・提携宅建業者の仲介により、相続不動産の取引を安心・安全にサポートします。
            </p>
          </div>

          {/* 取引フロー */}
          <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <h2 className="text-lg font-semibold mb-6">取引の流れ</h2>
            <div className="space-y-0">
              {flowSteps.map((step, i) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    {i < flowSteps.length - 1 && (
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
          </section>

          {/* ロール別安心ポイント */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">あなたの立場から見た安心ポイント</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {safetyPoints.map((sp) => {
                const c = colorMap[sp.color]
                return (
                  <div key={sp.role} className="bg-white rounded-2xl shadow-card p-5">
                    <h3 className={`text-sm font-semibold mb-3 ${c.text}`}>{sp.role}</h3>
                    <ul className="space-y-2">
                      {sp.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-neutral-600">
                          <CheckCircle className="w-3.5 h-3.5 text-success-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>

          {/* 提携宅建業者 */}
          <section className="bg-white rounded-2xl shadow-card p-8 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-secondary-500" />
              <h2 className="text-lg font-semibold">提携宅建業者について</h2>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Ouverでは、不動産取引の安全性を確保するため、宅地建物取引業の免許を持つ業者と提携しています。重要事項説明から契約締結、決済完了まで、資格を持つ専門家が責任を持って対応します。
            </p>
            <div className="p-4 bg-neutral-50 rounded-xl text-sm text-neutral-500">
              <p>提携業者は全社、国土交通大臣または都道府県知事の免許を保有しています。</p>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold mb-4">よくある質問</h2>
            <div className="space-y-3">
              {[
                { q: '取引相手の身元は確認されていますか？', a: 'はい。物件掲載時に売主の本人確認を実施します。買い手は入札時にアカウント認証が必要です。' },
                { q: 'トラブルが発生した場合はどうなりますか？', a: '提携宅建業者が間に入り、問題の解決をサポートします。また、Ouverのサポートチームにもお問い合わせいただけます。' },
                { q: '入金の安全性はどう確保されていますか？', a: '決済は提携宅建業者の立会いのもと行われます。直接の個人間送金は発生しません。' },
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

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
            >
              安心して始める
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
