'use client'

import {
  ArrowLeft,
  Download,
  CheckCircle,
  Clock,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { brokerNav } from '@/config/navigation'

export default function BrokerInvoiceDetailPage() {
  const invoice = {
    id: 'inv1',
    invoiceNumber: 'INV-2026-0001',
    propertyTitle: '大田区 商業地の一戸建て',
    propertyAddress: '東京都大田区蒲田5丁目',
    sellerName: '中村 一郎',
    buyerName: '株式会社アーバン',
    salePrice: 3200,
    brokerageFee: 204,
    brokerAmount: 122.4,
    ouverAmount: 81.6,
    status: 'paid' as const,
    issuedAt: '2026-03-28',
    closedAt: '2026-03-25',
    paidAt: '2026-04-05',
  }

  return (
    <DashboardShell
      title="請求書詳細"
      roleLabel="提携業者"
      userName="松本 大輝"
      navItems={brokerNav}
    >
      <Link href="/broker/invoices" className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        請求書一覧に戻る
      </Link>

      <div className="max-w-3xl">
        {/* 請求書プレビュー */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          {/* ヘッダー */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-primary-500">請求書</h1>
              <p className="text-sm text-neutral-400 mt-1">{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">株式会社Ouver</p>
              <p className="text-xs text-neutral-400 mt-0.5">東京都渋谷区</p>
            </div>
          </div>

          {/* ステータス */}
          <div className="flex items-center gap-2 mb-6">
            {invoice.status === 'paid' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-success-50 text-success-700">
                <CheckCircle className="w-3.5 h-3.5" />
                入金済み
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-warning-50 text-warning-700">
                <Clock className="w-3.5 h-3.5" />
                請求済み
              </span>
            )}
          </div>

          {/* 宛先 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs text-neutral-400 mb-1">請求先</p>
              <p className="text-sm font-medium">東京中央不動産株式会社</p>
              <p className="text-xs text-neutral-400 mt-0.5">松本 大輝 様</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-400 mb-1">発行日</p>
              <p className="text-sm">{invoice.issuedAt}</p>
              {invoice.paidAt && (
                <>
                  <p className="text-xs text-neutral-400 mt-2 mb-1">入金日</p>
                  <p className="text-sm">{invoice.paidAt}</p>
                </>
              )}
            </div>
          </div>

          {/* 物件情報 */}
          <div className="p-4 bg-neutral-50 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-primary-400" />
              <p className="text-sm font-medium">{invoice.propertyTitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500">
              <p>所在地: {invoice.propertyAddress}</p>
              <p>決済完了日: {invoice.closedAt}</p>
              <p>売主: {invoice.sellerName}</p>
              <p>買い手: {invoice.buyerName}</p>
            </div>
          </div>

          {/* 明細 */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 text-xs text-neutral-400 font-medium">項目</th>
                <th className="text-right py-2 text-xs text-neutral-400 font-medium">金額</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-100">
                <td className="py-3">成約価格</td>
                <td className="py-3 text-right price">{invoice.salePrice.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3">仲介手数料（税別）</td>
                <td className="py-3 text-right price">{invoice.brokerageFee.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3 pl-4 text-neutral-500">うち 業者配分（60%）</td>
                <td className="py-3 text-right price">{invoice.brokerAmount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
              </tr>
              <tr className="border-b border-neutral-100">
                <td className="py-3 pl-4 text-neutral-500">うち Ouver配分（40%）</td>
                <td className="py-3 text-right price">{invoice.ouverAmount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-200">
                <td className="py-3 font-semibold">Ouverへの振込額</td>
                <td className="py-3 text-right price text-lg font-semibold text-primary-500">{invoice.ouverAmount.toLocaleString()}<span className="text-xs font-normal text-neutral-400 ml-0.5">万円</span></td>
              </tr>
            </tfoot>
          </table>

          {/* 振込先 */}
          <div className="p-4 bg-primary-50 rounded-xl text-sm mb-6">
            <p className="font-medium text-primary-700 mb-2">振込先</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-primary-600">
              <p>銀行名: ○○銀行</p>
              <p>支店名: ○○支店</p>
              <p>口座種別: 普通</p>
              <p>口座番号: 1234567</p>
              <p>口座名義: カ）オウバー</p>
            </div>
          </div>

          <p className="text-xs text-neutral-400 text-center">
            ※ 金額はすべて税別表示です。別途消費税が加算されます。
          </p>
        </div>

        {/* 操作ボタン */}
        <div className="flex items-center gap-3 mt-4">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-500 rounded-xl hover:bg-primary-600 transition-colors">
            <Download className="w-4 h-4" />
            PDFダウンロード
          </button>
        </div>
      </div>
    </DashboardShell>
  )
}
