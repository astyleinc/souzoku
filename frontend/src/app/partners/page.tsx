import {
  Briefcase,
  Users,
  Globe,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const partnerTypes = [
  {
    icon: Users,
    title: '士業パートナー',
    color: 'secondary',
    description: '税理士・司法書士・弁護士・行政書士の方',
    benefits: [
      '相続相談のクライアントに不動産売却の選択肢を提供',
      '成約時に仲介手数料の15%を紹介料として受領',
      '紹介リンクまたは代理登録でかんたん紹介',
      'ダッシュボードで案件状況をリアルタイム確認',
    ],
  },
  {
    icon: Briefcase,
    title: '提携宅建業者',
    color: 'primary',
    description: '宅地建物取引業の免許をお持ちの業者様',
    benefits: [
      '成約した案件の仲介業務を担当',
      '安定した案件供給',
      '仲介手数料の50%以上を受領',
      '書類・進捗管理はプラットフォームで一元化',
    ],
  },
  {
    icon: Globe,
    title: 'NWパートナー',
    color: 'info',
    description: '士業の全国ネットワーク・協会の方',
    benefits: [
      '所属する士業の方にOuverの紹介機会を提供',
      'NW経由の成約で紹介手数料3%を受領',
      '士業会員へのサービス付加価値向上',
      '専用のNW管理ダッシュボード',
    ],
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  secondary: { bg: 'bg-secondary-50', text: 'text-secondary-500', border: 'border-secondary-200' },
  primary: { bg: 'bg-primary-50', text: 'text-primary-500', border: 'border-primary-200' },
  info: { bg: 'bg-info-50', text: 'text-info-500', border: 'border-info-200' },
}

const flowSteps = [
  { step: 'お問い合わせ', description: 'フォームまたはメールでお気軽にご連絡ください。' },
  { step: 'オンライン説明', description: 'サービス概要と提携条件についてご説明します。' },
  { step: '契約締結', description: 'パートナーシップ契約を締結します。' },
  { step: '運用開始', description: 'アカウント発行後、すぐにご利用いただけます。' },
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* ヒーロー */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold mb-2">提携パートナーネットワーク</h1>
            <p className="text-sm text-neutral-500 max-w-xl mx-auto">
              Ouverは士業・宅建業者・全国ネットワークとの連携により、相続不動産の売却を支援しています。
            </p>
          </div>

          {/* パートナー種別 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {partnerTypes.map((pt) => {
              const c = colorMap[pt.color]
              return (
                <div key={pt.title} className={`bg-white rounded-2xl shadow-card p-6 border ${c.border}`}>
                  <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <pt.icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <h2 className="text-sm font-semibold mb-0.5">{pt.title}</h2>
                  <p className="text-xs text-neutral-400 mb-4">{pt.description}</p>
                  <ul className="space-y-2">
                    {pt.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-neutral-600">
                        <CheckCircle className="w-3.5 h-3.5 text-success-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* パートナーシップの流れ */}
          <section className="bg-white rounded-2xl shadow-card p-8 mb-10">
            <h2 className="text-lg font-semibold mb-6">パートナーシップの流れ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flowSteps.map((fs, i) => (
                <div key={fs.step} className="text-center">
                  <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm font-semibold text-primary-500">{i + 1}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{fs.step}</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">{fs.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center">
            <p className="text-sm text-neutral-500 mb-4">パートナーシップに関心をお持ちですか？</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
            >
              パートナーシップについて問い合わせ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
