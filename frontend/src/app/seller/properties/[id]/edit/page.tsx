'use client'

import {
  Upload,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'
const selectClass = `${inputClass} bg-white`
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

export default function EditPropertyPage() {
  return (
    <DashboardShell
      title="物件情報の編集"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <Link href="/seller/properties" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        出品物件一覧に戻る
      </Link>

      <div className="max-w-2xl">
        <form className="space-y-10">
          {/* 物件基本情報 */}
          <section>
            <h2 className="text-base font-semibold mb-5">物件情報</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  物件名 <span className="text-error-500">*</span>
                </label>
                <input type="text" defaultValue="練馬区 駅近マンション 3LDK" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>
                  物件種別 <span className="text-error-500">*</span>
                </label>
                <select defaultValue="apartment" className={selectClass}>
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
                  <select defaultValue="東京都" className={selectClass}>
                    <option value="東京都">東京都</option>
                    <option value="神奈川県">神奈川県</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    市区町村以降 <span className="text-error-500">*</span>
                  </label>
                  <input type="text" defaultValue="練馬区豊玉北5丁目" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    土地面積 <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <input type="number" defaultValue="72.5" className={`${inputClass} pr-10`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">㎡</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>建物面積</label>
                  <div className="relative">
                    <input type="number" defaultValue="68.2" className={`${inputClass} pr-10`} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">㎡</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>築年</label>
                <input type="number" defaultValue="2003" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>
                  物件説明 <span className="text-error-500">*</span>
                </label>
                <textarea
                  rows={4}
                  defaultValue="練馬区の閑静な住宅街に位置する3LDKマンション。最寄り駅から徒歩5分、スーパー・学校も近く生活利便性に優れた立地です。"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>売却理由</label>
                <textarea
                  rows={2}
                  defaultValue="父の相続に伴い売却を希望"
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
                  <input type="number" defaultValue="3500" className={`${inputClass} pr-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>即決価格（任意）</label>
                <div className="relative">
                  <input type="number" defaultValue="4000" className={`${inputClass} pr-14`} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  売却の緊急度 <span className="text-error-500">*</span>
                </label>
                <select defaultValue="three_months" className={selectClass}>
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
                <select defaultValue="completed" className={selectClass}>
                  <option value="completed">相続登記済み</option>
                  <option value="in_progress">登記手続き中</option>
                  <option value="not_started">未着手</option>
                </select>
              </div>
            </div>
          </section>

          {/* 追加書類アップロード */}
          <section>
            <h2 className="text-base font-semibold mb-5">追加書類のアップロード</h2>
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-6 text-center hover:border-primary-300 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">
                クリックまたはドラッグ&ドロップでアップロード
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                PDF, JPG, PNG（最大10MB）
              </p>
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
              変更を保存する
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
