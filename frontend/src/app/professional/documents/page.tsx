'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Eye,
  Lock,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { EmptyState } from '@/components/shared/EmptyState'
import { professionalNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type Document = {
  id: string
  fileName: string
  documentType: string
  propertyTitle: string
  sellerName: string
  fileSize: string | null
  createdAt: string
}

export default function ProfessionalDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // 士業向けの閲覧許可済み書類一覧（APIが未実装の場合は空配列）
      const res = await api.get<unknown>('/documents/properties/professional/me')
      if (res.success) {
        setDocuments(toItems<Document>(res.data))
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleDownload = async (docId: string) => {
    const res = await api.get<{ downloadUrl: string }>(`/documents/${docId}/download`)
    if (res.success && res.data.downloadUrl) {
      window.open(res.data.downloadUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <DashboardShell title="書類閲覧" roleLabel="士業パートナー" navItems={professionalNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="書類閲覧"
      roleLabel="士業パートナー"
      navItems={professionalNav}
    >
      <div className="flex items-start gap-3 bg-info-50 border border-info-200 rounded-xl px-4 py-3 mb-6">
        <Lock className="w-4 h-4 text-info-500 mt-0.5 shrink-0" />
        <p className="text-sm text-info-700">
          売主が閲覧許可を出した書類のみ表示されます。
        </p>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="閲覧可能な書類はありません"
          description="売主が閲覧許可を出すと、ここに書類が表示されます"
        />
      ) : (
        <>
          {/* PC: テーブル */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-card">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold">
                閲覧可能な書類（{documents.length}件）
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">書類名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">物件</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">売主</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">アップロード日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                          <span className="font-medium">{doc.fileName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-neutral-500">{doc.documentType}</td>
                      <td className="py-3.5 px-5 text-neutral-500">{doc.propertyTitle}</td>
                      <td className="py-3.5 px-5 text-neutral-500">{doc.sellerName}</td>
                      <td className="py-3.5 px-5 text-neutral-400">{doc.createdAt?.slice(0, 10)}</td>
                      <td className="py-3.5 px-5">
                        <button
                          onClick={() => handleDownload(doc.id)}
                          className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            <h2 className="text-base font-semibold mb-3">
              閲覧可能な書類（{documents.length}件）
            </h2>
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl shadow-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.fileName}</p>
                      <p className="text-xs text-neutral-400">{doc.documentType}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.id)}
                    className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-neutral-400 mt-2">
                  <span>{doc.sellerName}</span>
                  <span className="mx-2">|</span>
                  <span>{doc.createdAt?.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
