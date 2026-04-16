'use client'

import {
  Building2,
  Gavel,
  Briefcase,
  Handshake,
  DollarSign,
  LayoutDashboard,
  Settings,
  Users,
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  MapPin,
  Home,
  Ruler,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { mockProperties } from '@/data/mock'
import { mockDocuments, mockBids, mockBrokers } from '@/data/mock-dashboard'

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', href: '/admin' },
  { icon: Building2, label: '物件管理', href: '/admin/properties' },
  { icon: Gavel, label: '入札管理', href: '/admin/bids' },
  { icon: Briefcase, label: '士業管理', href: '/admin/professionals' },
  { icon: Handshake, label: '業者管理', href: '/admin/brokers' },
  { icon: DollarSign, label: '収益管理', href: '/admin/revenue' },
  { icon: Users, label: 'ユーザー', href: '/admin/users' },
  { icon: Settings, label: '設定', href: '/admin/settings' },
]

export default function AdminPropertyDetailPage() {
  const property = mockProperties[0]
  const propertyBids = mockBids.filter((b) => b.propertyId === property.id)

  return (
    <DashboardShell
      title="物件審査"
      roleLabel="管理画面"
      userName="田中 太郎"
      navItems={navItems}
    >
      <Link href="/admin/properties" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        物件一覧に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 物件情報 */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">{property.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={property.status} />
                  <span className="text-xs text-neutral-400">{property.registrationStatus}</span>
                </div>
              </div>
              <p className="price text-2xl">
                {property.price.toLocaleString()}
                <span className="text-sm font-normal text-neutral-400 ml-1">万円</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">所在地</p>
                  <p>{property.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">種別</p>
                  <p>{property.type === 'apartment' ? 'マンション' : property.type === 'house' ? '一戸建て' : property.type === 'land' ? '土地' : 'その他'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">面積</p>
                  <p>{property.area}㎡</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">築年</p>
                  <p>{property.yearBuilt ? `${property.yearBuilt}年` : '-'}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 mb-1">物件説明</p>
              <p className="text-sm">{property.description}</p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-neutral-400 mb-1">売却理由</p>
              <p className="text-sm">{property.sellerReason}</p>
            </div>
          </div>

          {/* 書類確認 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">提出書類</h3>
            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-neutral-400">{doc.type} / {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4 text-success-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-warning-500" />
                    )}
                    <button className="text-xs text-primary-500 hover:underline">確認</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 入札状況 */}
          {propertyBids.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-4">入札状況 ({propertyBids.length}件)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left py-2 px-3 text-xs text-neutral-400 font-medium">入札者</th>
                      <th className="text-right py-2 px-3 text-xs text-neutral-400 font-medium">金額</th>
                      <th className="text-left py-2 px-3 text-xs text-neutral-400 font-medium">日時</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyBids.sort((a, b) => b.amount - a.amount).map((bid) => (
                      <tr key={bid.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50">
                        <td className="py-2 px-3">{bid.bidderName}</td>
                        <td className="py-2 px-3 text-right price">{bid.amount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></td>
                        <td className="py-2 px-3 text-neutral-400">{bid.updatedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* サイドパネル: 審査アクション */}
        <div className="space-y-6">
          {/* 審査アクション */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">審査アクション</h3>

            {property.status === 'reviewing' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">提携業者を割り当て</label>
                  <select className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl bg-white">
                    <option value="">業者を選択</option>
                    {mockBrokers.map((b) => (
                      <option key={b.id} value={b.id}>{b.companyName}</option>
                    ))}
                  </select>
                </div>
                <button className="w-full py-2.5 text-sm font-medium text-white bg-success-500 rounded-xl hover:bg-success-700 transition-colors">
                  承認して公開する
                </button>
                <button className="w-full py-2.5 text-sm font-medium text-error-700 bg-error-50 border border-error-500/30 rounded-xl hover:bg-error-100 transition-colors">
                  差戻し
                </button>
              </div>
            )}

            {property.status === 'pending_approval' && (
              <div className="space-y-3">
                <p className="text-sm text-neutral-400">売主が入札者を選択済みです。内容を確認して承認してください。</p>
                <button className="w-full py-2.5 text-sm font-medium text-white bg-success-500 rounded-xl hover:bg-success-700 transition-colors">
                  成約を承認
                </button>
                <button className="w-full py-2.5 text-sm font-medium text-error-700 bg-error-50 border border-error-500/30 rounded-xl hover:bg-error-100 transition-colors">
                  差戻し（再選択を依頼）
                </button>
              </div>
            )}

            {property.status !== 'reviewing' && property.status !== 'pending_approval' && (
              <p className="text-sm text-neutral-400">
                現在のステータス: {property.status === 'bidding' ? '入札受付中' : property.status === 'published' ? '公開中' : property.status === 'closed' ? '成約' : property.status}
              </p>
            )}
          </div>

          {/* 売主情報 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">売主情報</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-neutral-400">氏名</p>
                <p>中村 一郎</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">メール</p>
                <p>nakamura@example.com</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">電話</p>
                <p>03-1234-5678</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">紹介士業</p>
                <p>山田 太郎（税理士）</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">NW</p>
                <p>awaka cross</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
