'use client'

import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Lock,
} from 'lucide-react'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { EmptyState } from '@/components/shared/EmptyState'
import { professionalNav } from '@/config/navigation'
import { mockDocuments } from '@/data/mock-dashboard'

const docStatusConfig = {
  approved: { label: '承認済み', icon: CheckCircle, color: 'text-success-500' },
  pending: { label: '確認中', icon: Clock, color: 'text-warning-500' },
  rejected: { label: '再提出要', icon: XCircle, color: 'text-error-500' },
}

// 士業が閲覧できる書類（売主が閲覧許可を出したもの）
const accessibleDocuments = mockDocuments.filter((d) => d.status === 'approved')

const clientOptions = [
  { value: 'nakamura', label: '中村 一郎' },
  { value: 'kobayashi', label: '小林 誠' },
  { value: 'kato', label: '加藤 裕子' },
  { value: 'sasaki', label: '佐々木 恵' },
]

export default function ProfessionalDocumentsPage() {
  return (
    <DashboardShell
      title="書類閲覧"
      roleLabel="士業パートナー"
      userName="山田 太郎"
      navItems={professionalNav}
    >
      {/* 説明 */}
      <div className="flex items-start gap-3 bg-info-50 border border-info-200 rounded-xl px-4 py-3 mb-6">
        <Lock className="w-4 h-4 text-info-500 mt-0.5 shrink-0" />
        <p className="text-sm text-info-700">
          売主が閲覧許可を出した書類のみ表示されます。承認済みの書類が閲覧・ダウンロード可能です。
        </p>
      </div>

      {/* フィルタ */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterSelect
          options={clientOptions}
          placeholder="すべての売主"
        />
        <FilterSelect
          options={[
            { value: 'registry', label: '登記簿謄本' },
            { value: 'inheritance', label: '遺産分割協議書' },
            { value: 'identity', label: '本人確認書類' },
            { value: 'tax', label: '固定資産税納税通知書' },
          ]}
          placeholder="すべての書類種別"
        />
      </div>

      {accessibleDocuments.length === 0 ? (
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
                閲覧可能な書類（{accessibleDocuments.length}件）
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-neutral-100">
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">書類名</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">種別</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">売主</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">サイズ</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">アップロード日</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">ステータス</th>
                    <th className="text-left py-3 px-5 text-xs text-neutral-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {accessibleDocuments.map((doc) => {
                    const status = docStatusConfig[doc.status]
                    return (
                      <tr key={doc.id} className="border-t border-neutral-100 hover:bg-neutral-50/50">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-neutral-500">{doc.type}</td>
                        <td className="py-3.5 px-5 text-neutral-500">中村 一郎</td>
                        <td className="py-3.5 px-5 text-neutral-400">{doc.size}</td>
                        <td className="py-3.5 px-5 text-neutral-400">{doc.uploadedAt}</td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-1">
                            <status.icon className={`w-4 h-4 ${status.color}`} />
                            <span className="text-xs">{status.label}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* モバイル: カード */}
          <div className="lg:hidden space-y-3">
            <h2 className="text-base font-semibold mb-3">
              閲覧可能な書類（{accessibleDocuments.length}件）
            </h2>
            {accessibleDocuments.map((doc) => {
              const status = docStatusConfig[doc.status]
              return (
                <div key={doc.id} className="bg-white rounded-2xl shadow-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <p className="text-xs text-neutral-400">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <status.icon className={`w-3.5 h-3.5 ${status.color}`} />
                      <span className="text-xs text-neutral-500">{status.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-neutral-400">
                      <span>中村 一郎</span>
                      <span className="mx-2">|</span>
                      <span>{doc.size}</span>
                      <span className="mx-2">|</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </DashboardShell>
  )
}
