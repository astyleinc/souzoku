'use client'

import {
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { adminNav } from '@/config/navigation'

const inputClass = 'w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 transition-colors'
const selectClass = `${inputClass} bg-white`
const labelClass = 'block text-xs font-medium text-neutral-500 mb-1.5'

export default function AdminNewBrokerPage() {
  return (
    <DashboardShell
      title="宅建業者登録"
      roleLabel="管理者"
      userName="Ouver運営"
      navItems={adminNav}
    >
      <Link href="/admin/brokers" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        業者管理に戻る
      </Link>

      <div className="max-w-2xl">
        <form className="space-y-10">
          {/* 会社情報 */}
          <section>
            <h2 className="text-base font-semibold mb-5">会社情報</h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  会社名 <span className="text-error-500">*</span>
                </label>
                <input type="text" placeholder="例: 東京中央不動産株式会社" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>
                  宅建業免許番号 <span className="text-error-500">*</span>
                </label>
                <input type="text" placeholder="例: 東京都知事(3)第12345号" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>所在地</label>
                <input type="text" placeholder="例: 東京都中央区日本橋3丁目1-1" className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    代表電話 <span className="text-error-500">*</span>
                  </label>
                  <input type="tel" placeholder="例: 03-1234-5678" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    代表メール <span className="text-error-500">*</span>
                  </label>
                  <input type="email" placeholder="例: info@example.com" className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          {/* 担当者情報 */}
          <section>
            <h2 className="text-base font-semibold mb-5">担当者情報</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    担当者名 <span className="text-error-500">*</span>
                  </label>
                  <input type="text" placeholder="例: 松本 大輝" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>役職</label>
                  <input type="text" placeholder="例: 営業部長" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    担当者メール <span className="text-error-500">*</span>
                  </label>
                  <input type="email" placeholder="例: matsumoto@example.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>担当者電話</label>
                  <input type="tel" placeholder="例: 090-1234-5678" className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          {/* 振込口座 */}
          <section>
            <h2 className="text-base font-semibold mb-5">振込口座</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>銀行名</label>
                  <input type="text" placeholder="例: 三菱UFJ銀行" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>支店名</label>
                  <input type="text" placeholder="例: 日本橋支店" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>口座種別</label>
                  <select className={selectClass}>
                    <option value="ordinary">普通</option>
                    <option value="current">当座</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>口座番号</label>
                  <input type="text" placeholder="例: 1234567" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>口座名義</label>
                  <input type="text" placeholder="カタカナ" className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          {/* 送信 */}
          <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
            <Link
              href="/admin/brokers"
              className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all"
            >
              登録する
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}
