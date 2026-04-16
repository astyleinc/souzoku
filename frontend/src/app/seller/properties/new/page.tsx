'use client'

import {
  Building2,
  Gavel,
  FileText,
  LayoutDashboard,
  Bell,
  Upload,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/seller' },
  { icon: Building2, label: '出品物件', href: '/seller/properties' },
  { icon: Gavel, label: '入札一覧', href: '/seller/bids' },
  { icon: FileText, label: '書類管理', href: '/seller/documents' },
  { icon: Bell, label: '通知', href: '/seller/notifications' },
]

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'
const selectClass = `${inputClass} bg-white`
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

export default function NewPropertyPage() {
  return (
    <DashboardShell
      title="新規出品"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={navItems}
    >
      <div className="max-w-2xl">
        {/* 注意事項 */}
        <div className="bg-info-50 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-info-500 shrink-0 mt-0.5" />
          <div className="text-sm text-info-700">
            <p className="font-medium mb-1.5">出品に必要なもの</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>登記事項証明書（登記簿謄本）</li>
              <li>遺産分割協議書 または 遺言書（相続登記済みの場合は不要）</li>
              <li>本人確認書類</li>
              <li>物件の写真</li>
            </ul>
          </div>
        </div>

        <form className="space-y-10">
          {/* 物件基本情報 */}
          <section>
            <h2 className="text-base font-semibold mb-5">物件情報</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  物件名 <span className="text-error-500">*</span>
                </label>
                <input type="text" placeholder="例: 練馬区 駅近マンション 3LDK" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>
                  物件種別 <span className="text-error-500">*</span>
                </label>
                <select className={selectClass}>
                  <option value="">選択してください</option>
                  <option value="apartment">マンション</option>
                  <option value="house">一戸建て</option>
                  <option value="land">土地</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    都道府県 <span className="text-error-500">*</span>
                  </label>
                  <select className={selectClass}>
                    <option value="">選択してください</option>
                    <option value="東京都">東京都</option>
                    <option value="神奈川県">神奈川県</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    市区町村以降 <span className="text-error-500">*</span>
                  </label>
                  <input type="text" placeholder="例: 練馬区豊玉北5丁目" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    土地面積 <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <input type="number" placeholder="72.5" className={`${inputClass} pr-10`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">㎡</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>建物面積</label>
                  <div className="relative">
                    <input type="number" placeholder="72.5" className={`${inputClass} pr-10`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">㎡</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>築年</label>
                <input type="number" placeholder="例: 2003" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>
                  物件説明 <span className="text-error-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="物件の特徴、周辺環境、アクセスなどを記載してください"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>売却理由</label>
                <textarea
                  rows={2}
                  placeholder="相続の経緯など"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          {/* 価格・入札設定 */}
          <section>
            <h2 className="text-base font-semibold mb-5">価格・入札設定</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  希望価格（最低入札価格） <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <input type="number" min={1000} placeholder="3500" className={`${inputClass} pr-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5">※ 最低出品価格は1,000万円です</p>
              </div>

              <div>
                <label className={labelClass}>即決価格（任意）</label>
                <div className="relative">
                  <input type="number" placeholder="4000" className={`${inputClass} pr-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1.5">※ この価格以上の入札があった場合、即時通知されます</p>
              </div>

              <div>
                <label className={labelClass}>
                  売却の緊急度 <span className="text-error-500">*</span>
                </label>
                <select className={selectClass}>
                  <option value="">選択してください</option>
                  <option value="urgent">至急（1ヶ月以内）</option>
                  <option value="three_months">3ヶ月以内</option>
                  <option value="one_year">1年以内</option>
                  <option value="undecided">未定</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  相続登記の状況 <span className="text-error-500">*</span>
                </label>
                <select className={selectClass}>
                  <option value="">選択してください</option>
                  <option value="completed">相続登記済み</option>
                  <option value="in_progress">登記手続き中</option>
                  <option value="not_started">未着手</option>
                </select>
              </div>
            </div>
          </section>

          {/* 書類アップロード */}
          <section>
            <h2 className="text-base font-semibold mb-5">書類アップロード</h2>
            <div className="space-y-5">
              {[
                { label: '登記事項証明書', required: true },
                { label: '遺産分割協議書 / 遺言書', required: true },
                { label: '本人確認書類', required: true },
                { label: '物件写真', required: true },
                { label: '固定資産税納税通知書', required: false },
              ].map((doc) => (
                <div key={doc.label}>
                  <label className={labelClass}>
                    {doc.label} {doc.required && <span className="text-error-500">*</span>}
                  </label>
                  <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
                    <Upload className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">
                      クリックまたはドラッグ&ドロップでアップロード
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      PDF, JPG, PNG（最大10MB）
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 送信 */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            <Link
              href="/seller/properties"
              className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all"
            >
              審査に提出する
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
