'use client'

import {
  ArrowLeft,
  Star,
  Send,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'

export default function SellerReviewPage() {
  return (
    <DashboardShell
      title="取引評価"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <Link href="/seller" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        ダッシュボードに戻る
      </Link>

      <div className="max-w-2xl">
        {/* 案件情報 */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <h2 className="text-base font-semibold mb-3">対象案件</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-neutral-400 mb-1">物件名</p>
              <p>大田区 商業地の一戸建て</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-1">成約額</p>
              <p className="price">3,400<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-1">買い手</p>
              <p>株式会社アーバン</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 mb-1">担当業者</p>
              <p>東京中央不動産株式会社</p>
            </div>
          </div>
        </div>

        {/* 業者への評価 */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <h2 className="text-base font-semibold mb-1">仲介業者の評価</h2>
          <p className="text-xs text-neutral-400 mb-5">東京中央不動産株式会社への評価をお願いします</p>

          <div className="space-y-6">
            {[
              { label: '対応の丁寧さ', description: '連絡の早さや説明のわかりやすさ' },
              { label: '専門知識', description: '相続不動産に関する知識や提案力' },
              { label: '総合満足度', description: '取引全体を通した満足度' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-sm font-medium mb-1">{item.label}</p>
                <p className="text-xs text-neutral-400 mb-2">{item.description}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="p-0.5 text-neutral-200 hover:text-warning-400 transition-colors">
                      <Star className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <p className="text-sm font-medium mb-1.5">コメント</p>
              <textarea
                rows={3}
                placeholder="取引に関するご感想をお聞かせください（任意）"
                className="w-full px-4 py-3 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* 送信 */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/seller"
            className="px-4 py-2.5 text-sm font-medium text-neutral-500 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
          >
            あとで評価する
          </Link>
          <button className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-medium text-white bg-cta-500 rounded-xl hover:bg-cta-600 active:scale-[0.98] transition-all">
            <Send className="w-4 h-4" />
            評価を送信する
          </button>
        </div>
      </div>
    </DashboardShell>
  )
}
