'use client'

import { useState, useEffect } from 'react'
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
import { api, toItems } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

type PropertyDoc = {
  id: string
  fileName: string
  documentType: string
}

type Professional = {
  id: string
  name: string
  qualification: string
  officeName: string
}

type Permission = {
  documentId: string
  professionalId: string
}

type PermissionsData = {
  documents: PropertyDoc[]
  professionals: Professional[]
  permissions: Permission[]
}

export default function SellerDocumentPermissionsPage() {
  const [data, setData] = useState<PermissionsData | null>(null)
  const [localPermissions, setLocalPermissions] = useState<Record<string, Record<string, boolean>>>({})
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [propsRes] = await Promise.all([
        api.get<unknown>('/documents/properties/seller/me'),
      ])
      const propsItems = propsRes.success ? toItems<{ id: string }>(propsRes.data) : []
      if (!propsRes.success) {
        setFetchError(true)
      }
      if (propsRes.success && propsItems.length > 0) {
        const propertyId = propsItems[0].id
        const [docsRes, permsRes] = await Promise.all([
          api.get<unknown>(`/documents/properties/${propertyId}/documents`),
          api.get<PermissionsData>(`/documents/properties/${propertyId}/documents/permissions`),
        ])

        const docs = docsRes.success ? toItems<PropertyDoc>(docsRes.data) : []
        const permissions = permsRes.success ? permsRes.data : { documents: docs, professionals: [], permissions: [] }
        permissions.documents = docs

        setData(permissions)

        const permMap: Record<string, Record<string, boolean>> = {}
        for (const prof of permissions.professionals) {
          permMap[prof.id] = {}
          for (const doc of docs) {
            permMap[prof.id][doc.id] = permissions.permissions.some(
              (p) => p.documentId === doc.id && p.professionalId === prof.id
            )
          }
        }
        setLocalPermissions(permMap)
      }
      setLoading(false)
    }
    load()
  }, [])

  const togglePermission = (profId: string, docId: string) => {
    setLocalPermissions((prev) => ({
      ...prev,
      [profId]: {
        ...prev[profId],
        [docId]: !prev[profId]?.[docId],
      },
    }))
  }

  if (loading) {
    return (
      <DashboardShell title="書類閲覧許可" roleLabel="売主" navItems={sellerNav}>
        <LoadingSpinner />
      </DashboardShell>
    )
  }

  const documents = data?.documents ?? []
  const professionals = data?.professionals ?? []

  return (
    <DashboardShell
      title="書類閲覧許可"
      roleLabel="売主"
      navItems={sellerNav}
    >
      <Link href="/seller/documents" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        書類管理に戻る
      </Link>

      {fetchError && (
        <div className="flex items-center gap-2 p-3 mb-6 text-sm text-error-700 bg-error-50 rounded-xl">
          データの取得に失敗しました。ページを更新してください。
        </div>
      )}

      <p className="text-sm text-neutral-500 mb-6">
        紹介士業パートナーが閲覧できる書類を管理できます。許可した書類のみ、士業パートナーの画面に表示されます。
      </p>

      {professionals.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <Users className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-400">閲覧許可を設定できる士業パートナーがいません</p>
        </div>
      ) : (
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
                {documents.map((doc) => {
                  const isAllowed = localPermissions[prof.id]?.[doc.id] ?? false
                  return (
                    <div
                      key={doc.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${isAllowed ? 'border-success-200 bg-success-50/30' : 'border-neutral-100 bg-neutral-50/50'}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className={`w-4 h-4 shrink-0 ${isAllowed ? 'text-success-500' : 'text-neutral-300'}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{doc.fileName}</p>
                          <p className="text-xs text-neutral-400">{doc.documentType}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => togglePermission(prof.id, doc.id)}
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
      )}

      {professionals.length > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <button
            disabled={saving}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
          <Link href="/seller/documents" className="px-6 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors">
            キャンセル
          </Link>
        </div>
      )}
    </DashboardShell>
  )
}
