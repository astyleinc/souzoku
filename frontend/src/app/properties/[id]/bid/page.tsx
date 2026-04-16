'use client'

import {
  ArrowLeft,
  Building2,
  AlertTriangle,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { mockProperties } from '@/data/mock'

const instantBuyPrice = 4000

export default function PropertyBidPage() {
  const property = mockProperties[0]

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full">
        <Link
          href={`/properties/${property.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          物件詳細に戻る
        </Link>

        {/* 物件概要 */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
            <div>
              <h1 className="text-base font-semibold">{property.title}</h1>
              <p className="text-xs text-neutral-400 mt-0.5">{property.address}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-500">
                <span>希望価格: <span className="price font-medium text-neutral-700">{property.price.toLocaleString()}</span>万円</span>
                <span>即決価格: <span className="price font-medium text-cta-500">{instantBuyPrice.toLocaleString()}</span>万円</span>
              </div>
            </div>
          </div>
        </div>

        {/* 入札フォーム */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-semibold mb-4">入札する</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">入札金額（万円）</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder={`${property.price.toLocaleString()} 以上`}
                  className="w-full px-4 py-3 text-lg font-medium border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors price"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-neutral-400">万円</span>
              </div>
              <p className="text-xs text-neutral-400 mt-1.5">
                最低入札金額: <span className="price font-medium">{property.price.toLocaleString()}</span> 万円（希望価格）
              </p>
            </div>

            {/* 即決価格注意 */}
            <div className="flex items-start gap-2 p-3 bg-cta-50 rounded-xl">
              <Info className="w-4 h-4 text-cta-500 shrink-0 mt-0.5" />
              <p className="text-xs text-cta-700 leading-relaxed">
                即決価格（{instantBuyPrice.toLocaleString()}万円）以上で入札すると、売主が承認した場合に即決で成約となります。
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">入札条件コメント（任意）</label>
              <textarea
                rows={3}
                placeholder="引渡時期の希望など、取引条件があればご記入ください"
                className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors resize-none"
              />
            </div>

            {/* 注意事項 */}
            <div className="flex items-start gap-2 p-3 bg-neutral-50 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-500 space-y-1">
                <p>他の入札者の金額は公開されません（封印入札方式）。</p>
                <p>入札後も期間中であれば金額の更新が可能です。</p>
                <p>入札のキャンセルは入札期間中のみ可能です。</p>
              </div>
            </div>

            <button className="w-full py-3 text-sm font-semibold text-white bg-cta-500 rounded-xl hover:bg-cta-600 transition-colors">
              入札を確定する
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
