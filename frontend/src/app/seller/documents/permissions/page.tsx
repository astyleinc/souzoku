'use client'

import {
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { mockDocuments } from '@/data/mock-dashboard'

const professionals = [
  { id: 'p1', name: '山田 太郎', qualification: '税理士', officeName: '山田税理士事務所' },
  { id: 'p2', name: '佐藤 花子', qualification: '司法書士', officeName: '佐藤法務事務所' },
]

const approvedDocs = mockDocuments.filter((d) => d.status === 'approved')

const initialPermissions: Record<string, Record<string, boolean>> = {
  p1: { d1: true, d2: true, d3: false, d4: true },
  p2: { d1: true, d2: false, d3: false, d4: false },
}

export default function SellerDocumentPermissionsPage() {
  return (
    <DashboardShell
      title="書類閲覧許可"
      roleLabel="売主"
      userName="中村 一郎"
      navItems={sellerNav}
    >
      <Link href="/seller/documents" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        書類管理に戻る
      </Link>

      <p className="text-sm text-neutral-500 mb-6">
        紹介士業パートナーが閲覧できる書類を管理できます。許可した書類のみ、士業パートナーの画面に表示されます。
      </p>

      {/* 士業ごとの許可設定 */}
      <div className="space-y-6">
        {professionals.map((prof) => (
          <div key={prof.id} className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-secondary-50 rounded-xl flex items-center justify-center">
                <Users className="w-4 h-4 text-secondary-500" />
              </div>
              <div>
                <p className="text-sm font-semibold">{prof.name}</p>
                <p className="text-xs text-neutral-400">{prof.qualification} / {prof.officeName}</p>
              </div>
            </div>

            <div className="space-y-2">
              {approvedDocs.map((doc) => {
                const isAllowed = initialPermissions[prof.id]?.[doc.id] ?? false
                return (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${isAllowed ? 'border-success-200 bg-success-50/30' : 'border-neutral-100 bg-neutral-50/50'}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className={`w-4 h-4 shrink-0 ${isAllowed ? 'text-success-500' : 'text-neutral-300'}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-neutral-400">{doc.type}</p>
                      </div>
                    </div>
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0 ${
                        isAllowed
                          ? 'text-success-600 bg-success-50 hover:bg-success-100'
                          : 'text-neutral-500 bg-neutral-100 hover:bg-neutral-200'
                      }`}
                    >
                      {isAllowed ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          許可中
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          非公開
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors">
          保存する
        </button>
        <Link href="/seller/documents" className="px-6 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
          キャンセル
        </Link>
      </div>
    </DashboardShell>
  )
}
