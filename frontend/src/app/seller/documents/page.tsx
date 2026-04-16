'use client'

import {
  Upload,
  Download,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { mockDocuments } from '@/data/mock-dashboard'

const docStatusIcon = {
  approved: <CheckCircle className="w-4 h-4 text-success-500" />,
  pending: <Clock className="w-4 h-4 text-warning-500" />,
  rejected: <XCircle className="w-4 h-4 text-error-500" />,
}

const docStatusLabel = {
  approved: '承認済み',
  pending: '確認中',
  rejected: '再提出要',
}

export default function SellerDocumentsPage() {
  return (
    <DashboardShell
      title="書類管理"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      {/* 閲覧許可管理リンク */}
      <div className="flex items-center justify-end mb-4">
        <Link
          href="/seller/documents/permissions"
          className="inline-flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
        >
          <Shield className="w-3.5 h-3.5" />
          士業への閲覧許可を管理
        </Link>
      </div>

      {/* アップロードエリア */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">書類をアップロード</p>
          <p className="text-xs text-neutral-400">
            クリックまたはドラッグ&ドロップ（PDF, JPG, PNG / 最大10MB）
          </p>
        </div>
      </div>

      {/* 物件選択 */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm text-neutral-400">物件:</label>
        <select className="px-3 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white">
          <option value="">すべての物件</option>
          <option value="1">練馬区 駅近マンション 3LDK</option>
          <option value="2">杉並区 閑静な住宅地の土地</option>
          <option value="3">世田谷区 二世帯住宅</option>
        </select>
      </div>

      {/* PC: テーブル */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">書類名</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種類</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">サイズ</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">アップロード日</th>
                <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {mockDocuments.map((doc) => (
                <tr key={doc.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-neutral-500">{doc.type}</td>
                  <td className="py-3.5 px-5 text-neutral-500">{doc.size}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1.5">
                      {docStatusIcon[doc.status]}
                      <span className="text-sm">{docStatusLabel[doc.status]}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-neutral-400">{doc.uploadedAt}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <button className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* モバイル: カード */}
      <div className="lg:hidden space-y-3">
        {mockDocuments.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                <span className="text-sm font-medium truncate">{doc.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {docStatusIcon[doc.status]}
                <span className="text-xs">{docStatusLabel[doc.status]}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
              <span>{doc.type}</span>
              <span>{doc.size}</span>
              <span>{doc.uploadedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 閲覧許可 */}
      <div className="bg-white rounded-2xl shadow-card mt-6">
        <div className="px-5 py-4">
          <h2 className="text-base font-semibold">書類の閲覧許可</h2>
          <p className="text-xs text-neutral-400 mt-1">士業パートナーへの閲覧権限を管理します</p>
        </div>
        <div className="px-5 pb-5 space-y-4">
          {[
            { name: '山田 太郎（税理士）', hasAccess: true },
            { name: '佐藤 花子（司法書士）', hasAccess: false },
          ].map((pro) => (
            <div key={pro.name} className="flex items-center justify-between py-2">
              <span className="text-sm">{pro.name}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={pro.hasAccess} className="sr-only peer" />
                <div className="w-9 h-5 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
