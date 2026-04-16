'use client'

import { useState } from 'react'
import {
  UserCheck,
  FileText,
  Rocket,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    icon: UserCheck,
    title: 'ロールを確認',
    description: 'あなたの利用目的に合ったロールを選択してください。',
  },
  {
    icon: FileText,
    title: 'プロフィールを完成',
    description: '基本情報を入力して、サービスをフル活用しましょう。',
  },
  {
    icon: Rocket,
    title: '最初のアクション',
    description: '準備ができました。さっそく始めましょう。',
  },
]

const roles = [
  { key: 'seller', label: '売主（相続人）', description: '相続した不動産を売却したい', href: '/seller', color: 'primary' },
  { key: 'buyer', label: '買い手', description: '相続不動産を購入・投資したい', href: '/buyer', color: 'info' },
  { key: 'professional', label: '士業パートナー', description: '相続案件のクライアントを紹介したい', href: '/professional', color: 'secondary' },
]

const roleColorMap: Record<string, string> = {
  primary: 'border-primary-300 bg-primary-50',
  info: 'border-info-300 bg-info-50',
  secondary: 'border-secondary-300 bg-secondary-50',
}

export default function WelcomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const selectedRoleData = roles.find((r) => r.key === selectedRole)

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary-500 tracking-tight">
            Ouver
          </Link>
          <p className="text-sm text-neutral-400 mt-1">ようこそ！アカウントの設定を始めましょう。</p>
        </div>

        {/* プログレスバー */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((step, i) => (
            <div key={step.title} className="flex-1 flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 ${
                i < currentStep
                  ? 'bg-success-500 text-white'
                  : i === currentStep
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-200 text-neutral-400'
              }`}>
                {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${i < currentStep ? 'bg-success-500' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ステップラベル */}
        <div className="flex justify-between mb-6">
          {steps.map((step, i) => (
            <p key={step.title} className={`text-xs text-center flex-1 ${i === currentStep ? 'text-primary-500 font-medium' : 'text-neutral-400'}`}>
              {step.title}
            </p>
          ))}
        </div>

        {/* コンテンツ */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          {currentStep === 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-1">利用目的を教えてください</h2>
              <p className="text-sm text-neutral-400 mb-5">後から変更することもできます。</p>
              <div className="space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.key}
                    onClick={() => setSelectedRole(role.key)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                      selectedRole === role.key
                        ? roleColorMap[role.color]
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <p className="text-sm font-medium">{role.label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{role.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold mb-1">プロフィールを完成させましょう</h2>
              <p className="text-sm text-neutral-400 mb-5">
                {selectedRoleData?.label}として登録します。基本情報を入力してください。
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">表示名</label>
                  <input
                    type="text"
                    placeholder="お名前または会社名"
                    className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">電話番号</label>
                  <input
                    type="tel"
                    placeholder="03-1234-5678"
                    className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">住所</label>
                  <input
                    type="text"
                    placeholder="東京都○○区○○"
                    className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-7 h-7 text-success-500" />
              </div>
              <h2 className="text-lg font-semibold mb-1">準備ができました！</h2>
              <p className="text-sm text-neutral-400 mb-6">
                {selectedRoleData?.label}としてOuverをご利用いただけます。
              </p>
              <Link
                href={selectedRoleData?.href ?? '/'}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors"
              >
                ダッシュボードへ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* ナビゲーション */}
          {currentStep < 2 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
              {currentStep > 0 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  戻る
                </button>
              ) : (
                <span />
              )}
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 0 && !selectedRole}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                次へ
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* スキップ */}
        {currentStep < 2 && (
          <p className="text-center mt-4">
            <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
              スキップしてトップへ
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
