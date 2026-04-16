'use client'

import {
  Copy,
  Link2,
  Users,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import { useState } from 'react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { professionalNav } from '@/config/navigation'

const nwOptions = [
  { value: '', label: 'NW経由ではない（直接紹介）' },
  { value: 'awaka', label: 'awaka cross' },
  { value: 'ui-consulting', label: 'UIコンサルティング' },
  { value: 'mitsukaru', label: 'ミツカル' },
]

export default function ProfessionalReferralLinkPage() {
  const [copied, setCopied] = useState(false)
  const [selectedNw, setSelectedNw] = useState('')

  const referralCode = 'TAX_YAMADA_001'
  const baseUrl = 'https://ouver.jp/register'
  const referralUrl = selectedNw
    ? `${baseUrl}?ref=${referralCode}&nw=${selectedNw}`
    : `${baseUrl}?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardShell
      title="紹介リンク"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={professionalNav}
    >
      <div className="max-w-2xl space-y-6">
        {/* 紹介リンク発行 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Link2 className="w-5 h-5 text-primary-500" />
            <h2 className="text-base font-semibold">紹介リンク発行</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">
            このリンクを売主に共有すると、紹介案件として自動的にあなたに紐づけられます
          </p>

          {/* NW選択 */}
          <div className="mb-4">
            <label className="text-sm font-medium text-neutral-600 mb-1.5 block">
              NW（ネットワーク）経由の場合
            </label>
            <select
              value={selectedNw}
              onChange={(e) => setSelectedNw(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white"
            >
              {nwOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-neutral-400 mt-1.5">
              紹介する売主がNW経由の場合、該当するNWを選択してください。報酬配分に影響します。
            </p>
          </div>

          {/* リンク表示 + コピー */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 px-3 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-600 font-mono"
            />
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  コピー済み
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  コピー
                </>
              )}
            </button>
          </div>
        </div>

        {/* 代理登録 */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-secondary-500" />
            <h2 className="text-base font-semibold">代理登録</h2>
          </div>
          <p className="text-sm text-neutral-400 mb-5">
            売主に代わって物件情報を登録できます。売主のメールアドレスに確認メールが送信されます。
          </p>
          <button className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-cta-500 hover:bg-cta-600 rounded-xl transition-colors">
            <ExternalLink className="w-4 h-4" />
            代理登録を開始する
          </button>
        </div>

        {/* 報酬配分の説明 */}
        <div className="bg-neutral-50 rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-3">報酬配分について</h3>
          <div className="space-y-2 text-sm text-neutral-600">
            <div className="flex justify-between">
              <span>NW経由の紹介</span>
              <span className="font-medium">仲介手数料の15%</span>
            </div>
            <div className="flex justify-between">
              <span>直接紹介</span>
              <span className="font-medium">仲介手数料の15%</span>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-3">
            NW経由の場合、NWに3%が配分されます。士業の紹介料率は変わりません。
          </p>
        </div>
      </div>
    </DashboardShell>
  )
}
