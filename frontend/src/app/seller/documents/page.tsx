'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Upload,
  Download,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { sellerNav } from '@/config/navigation'
import { api, toItems } from '@/lib/api'

type Document = {
  id: string
  name: string
  type: string
  size: string
  status: 'approved' | 'pending' | 'rejected'
  uploadedAt: string
}

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

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function SellerDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadDocuments = useCallback(async () => {
    const res = await api.get<unknown>('/documents/properties/seller/me')
    if (res.success) {
      setDocuments(toItems<Document>(res.data))
    }
  }, [])

  useEffect(() => {
    loadDocuments().then(() => setLoading(false))
  }, [loadDocuments])

  const uploadFiles = async (files: File[]) => {
    const valid = files.filter((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) return false
      if (f.size > MAX_FILE_SIZE) return false
      return true
    })
    if (valid.length === 0) {
      setUploadError('対応形式（PDF, JPG, PNG）で10MB以下のファイルを選択してください')
      return
    }
    setUploadError(null)
    setUploading(true)
    for (const file of valid) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)
      await api.upload('/documents/upload', formData)
    }
    await loadDocuments()
    setUploading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) uploadFiles(files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) uploadFiles(files)
  }

  if (loading) {
    return (
      <DashboardShell title="書類管理" roleLabel="売主" navItems={sellerNav}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell
      title="書類管理"
      roleLabel="売主"
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            dragOver ? 'border-primary-400 bg-primary-50' : 'border-neutral-200 hover:border-primary-300'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary-400 mx-auto mb-3 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          )}
          <p className="text-sm font-medium text-foreground mb-1">
            {uploading ? 'アップロード中...' : '書類をアップロード'}
          </p>
          <p className="text-xs text-neutral-400">
            クリックまたはドラッグ&ドロップ（PDF, JPG, PNG / 最大10MB）
          </p>
        </div>
        {uploadError && (
          <div className="flex items-center gap-2 mt-3 text-sm text-error-500">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {uploadError}
          </div>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center">
          <FileText className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
          <p className="text-sm text-neutral-400">アップロードされた書類はありません</p>
        </div>
      ) : (
        <>
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
                  {documents.map((doc) => (
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
                      <td className="py-3.5 px-5 text-neutral-400">{doc.uploadedAt?.slice(0, 10)}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => window.open(`/api/documents/${doc.id}/download?preview=true`, '_blank')}
                            className="p-1.5 text-neutral-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(`/api/documents/${doc.id}/download`, '_blank')}
                            className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                          >
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
            {documents.map((doc) => (
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
                  <span>{doc.uploadedAt?.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
