'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  MapPin,
  Home,
  Ruler,
  Calendar,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { adminNav } from '@/config/navigation'
import { type PropertyType, PROPERTY_TYPE_LABEL } from '@/data/mock'
import { api, toItems } from '@/lib/api'

type PropertyDetail = {
  id: string
  title: string
  status: string
  propertyType: string
  prefecture: string
  city: string
  address: string
  askingPrice: number
  landArea: number | null
  buildingArea: number | null
  builtYear: number | null
  description: string
  sellerReason: string | null
  registrationStatus: string
  sellerId: string
  createdAt: string
}

type DocItem = {
  id: string
  fileName: string
  documentType: string
  createdAt: string
}

type BidItem = {
  id: string
  bidderName: string
  amount: number
  updatedAt: string
}

type BrokerItem = {
  id: string
  companyName: string
}

export default function AdminPropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [documents, setDocuments] = useState<DocItem[]>([])
  const [bids, setBids] = useState<BidItem[]>([])
  const [brokers, setBrokers] = useState<BrokerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBrokerId, setSelectedBrokerId] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const [propRes, docRes, bidRes, brokerRes] = await Promise.all([
        api.get<unknown>(`/properties/${params.id}`),
        api.get<unknown>(`/properties/${params.id}/documents`),
        api.get<unknown>(`/bids/property/${params.id}`).catch(() => ({ success: false, data: { items: [] } })),
        api.get<unknown>('/brokers'),
      ])
      if (propRes.success) setProperty(propRes.data as PropertyDetail)
      if (docRes.success) setDocuments(toItems<DocItem>(docRes.data))
      if (bidRes.success) setBids(toItems<BidItem>(bidRes.data).sort((a: BidItem, b: BidItem) => b.amount - a.amount))
      if (brokerRes.success) setBrokers(toItems<BrokerItem>(brokerRes.data))
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <DashboardShell title="物件審査" roleLabel="管理画面" navItems={adminNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  if (!property) {
    return (
      <DashboardShell title="物件審査" roleLabel="管理画面" navItems={adminNav}>
        <p className="text-sm text-neutral-400 text-center py-20">物件が見つかりませんでした</p>
      </DashboardShell>
    )
  }

  const toMan = (yen: number) => Math.round(yen / 10000)
  const toArea = (raw: number | null) => raw ? (raw / 10).toFixed(1) : '-'

  const handleApprove = async () => {
    if (!selectedBrokerId) {
      setActionError('業者を選択してください')
      return
    }
    setActionLoading(true)
    setActionError(null)
    const res = await api.patch(`/admin/properties/${params.id}/approve`, { assignedBrokerId: selectedBrokerId })
    if (res.success) {
      setProperty((prev) => prev ? { ...prev, status: 'published' } : prev)
    } else {
      setActionError('承認に失敗しました')
    }
    setActionLoading(false)
  }

  const handleReturn = async () => {
    setActionLoading(true)
    setActionError(null)
    const res = await api.patch(`/admin/properties/${params.id}/return`, { returnReason: '管理者による差戻し' })
    if (res.success) {
      setProperty((prev) => prev ? { ...prev, status: 'returned' } : prev)
    } else {
      setActionError('差戻しに失敗しました')
    }
    setActionLoading(false)
  }

  const handleClose = async () => {
    setActionLoading(true)
    setActionError(null)
    const res = await api.patch(`/admin/properties/${params.id}/close`, {})
    if (res.success) {
      setProperty((prev) => prev ? { ...prev, status: 'closed' } : prev)
    } else {
      setActionError('成約承認に失敗しました')
    }
    setActionLoading(false)
  }

  return (
    <DashboardShell
      title="物件審査"
      roleLabel="管理画面"
      navItems={adminNav}
    >
      <Link href="/admin/properties" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        物件一覧に戻る
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                {toMan(property.askingPrice).toLocaleString()}
                <span className="text-sm font-normal text-neutral-400 ml-1">万円</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">所在地</p>
                  <p>{property.prefecture}{property.city}{property.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">種別</p>
                  <p>{PROPERTY_TYPE_LABEL[property.propertyType as PropertyType] ?? property.propertyType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">面積</p>
                  <p>{toArea(property.landArea)}㎡</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">築年</p>
                  <p>{property.builtYear ? `${property.builtYear}年` : '-'}</p>
                </div>
              </div>
            </div>

            {property.description && (
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 mb-1">物件説明</p>
                <p className="text-sm">{property.description}</p>
              </div>
            )}
            {property.sellerReason && (
              <div className="mt-4">
                <p className="text-xs text-neutral-400 mb-1">売却理由</p>
                <p className="text-sm">{property.sellerReason}</p>
              </div>
            )}
          </div>

          {/* 書類確認 */}
          {documents.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-4">提出書類</h3>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <div>
                        <p className="text-sm font-medium">{doc.fileName}</p>
                        <p className="text-xs text-neutral-400">{doc.documentType}</p>
                      </div>
                    </div>
                    <button className="text-xs text-primary-500 hover:underline">確認</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 入札状況 */}
          {bids.length > 0 && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="text-base font-semibold mb-4">入札状況 ({bids.length}件)</h3>
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
                    {bids.map((bid) => (
                      <tr key={bid.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50">
                        <td className="py-2 px-3">{bid.bidderName}</td>
                        <td className="py-2 px-3 text-right price">{toMan(bid.amount).toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-1">万円</span></td>
                        <td className="py-2 px-3 text-neutral-400">{bid.updatedAt?.slice(0, 10)}</td>
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
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-base font-semibold mb-4">審査アクション</h3>

            {actionError && (
              <div className="mb-3 p-3 bg-error-50 border border-error-200 rounded-xl text-sm text-error-600">
                {actionError}
              </div>
            )}

            {property.status === 'reviewing' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">提携業者を割り当て</label>
                  <select
                    value={selectedBrokerId}
                    onChange={(e) => setSelectedBrokerId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl bg-white"
                  >
                    <option value="">業者を選択</option>
                    {brokers.map((b) => (
                      <option key={b.id} value={b.id}>{b.companyName}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="w-full py-2.5 text-sm font-medium text-white bg-success-500 rounded-xl hover:bg-success-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? '処理中...' : '承認して公開する'}
                </button>
                <button
                  onClick={handleReturn}
                  disabled={actionLoading}
                  className="w-full py-2.5 text-sm font-medium text-error-700 bg-error-50 border border-error-500/30 rounded-xl hover:bg-error-100 transition-colors disabled:opacity-50"
                >
                  差戻し
                </button>
              </div>
            )}

            {property.status === 'pending_approval' && (
              <div className="space-y-3">
                <p className="text-sm text-neutral-400">売主が入札者を選択済みです。内容を確認して承認してください。</p>
                <button
                  onClick={handleClose}
                  disabled={actionLoading}
                  className="w-full py-2.5 text-sm font-medium text-white bg-success-500 rounded-xl hover:bg-success-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? '処理中...' : '成約を承認'}
                </button>
                <button
                  onClick={handleReturn}
                  disabled={actionLoading}
                  className="w-full py-2.5 text-sm font-medium text-error-700 bg-error-50 border border-error-500/30 rounded-xl hover:bg-error-100 transition-colors disabled:opacity-50"
                >
                  差戻し（再選択を依頼）
                </button>
              </div>
            )}

            {property.status !== 'reviewing' && property.status !== 'pending_approval' && (
              <p className="text-sm text-neutral-400">
                現在のステータスでは審査アクションは不要です。
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
