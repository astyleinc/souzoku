import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

export type InvoiceTarget = 'broker' | 'professional' | 'nw'

export type InvoicePdfInput = {
  target: InvoiceTarget
  invoiceNumber: string
  issuedAt: Date
  issuerName: string
  issuerAddress?: string
  issuerQualifiedNumber?: string
  recipientName: string
  recipientAddress?: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    reducedTaxRate?: boolean
  }>
  amount: number
  taxAmount: number
  totalAmount: number
  note?: string
}

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  meta: { textAlign: 'right', fontSize: 9 },
  section: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#6B7280', fontSize: 9 },
  total: { marginTop: 12, paddingTop: 8, borderTop: '1 solid #111827', flexDirection: 'row', justifyContent: 'space-between' },
  table: { marginTop: 12, borderTop: '1 solid #E5E7EB' },
  trHead: { flexDirection: 'row', backgroundColor: '#F3F4F6', paddingVertical: 4 },
  tr: { flexDirection: 'row', borderBottom: '1 solid #E5E7EB', paddingVertical: 4 },
  cell: { paddingHorizontal: 4 },
  c1: { flex: 4 },
  c2: { flex: 1, textAlign: 'right' },
  c3: { flex: 1, textAlign: 'right' },
  c4: { flex: 1.5, textAlign: 'right' },
  small: { fontSize: 8, color: '#6B7280' },
})

const titleByTarget: Record<InvoiceTarget, string> = {
  broker: 'Invoice / 請求書',
  professional: 'Statement / 支払調書（士業）',
  nw: 'Statement / 支払調書（NW）',
}

const toJpy = (n: number) => `JPY ${n.toLocaleString('en-US')}`
const formatDate = (d: Date) => d.toISOString().slice(0, 10)

const buildDocument = (input: InvoicePdfInput) =>
  React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(Text, { style: styles.title }, titleByTarget[input.target]),
        React.createElement(
          View,
          { style: styles.meta },
          React.createElement(Text, {}, `Invoice No. ${input.invoiceNumber}`),
          React.createElement(Text, {}, `Issued: ${formatDate(input.issuedAt)}`),
        ),
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.label }, 'Bill To / 宛先'),
        React.createElement(Text, {}, input.recipientName),
        input.recipientAddress
          ? React.createElement(Text, { style: styles.small }, input.recipientAddress)
          : null,
      ),
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.label }, 'Issued By / 発行元'),
        React.createElement(Text, {}, input.issuerName),
        input.issuerAddress
          ? React.createElement(Text, { style: styles.small }, input.issuerAddress)
          : null,
        input.issuerQualifiedNumber
          ? React.createElement(Text, { style: styles.small }, `適格請求書発行事業者登録番号: ${input.issuerQualifiedNumber}`)
          : null,
      ),
      React.createElement(
        View,
        { style: styles.table },
        React.createElement(
          View,
          { style: styles.trHead },
          React.createElement(Text, { style: [styles.cell, styles.c1] }, 'Description / 内訳'),
          React.createElement(Text, { style: [styles.cell, styles.c2] }, 'Qty'),
          React.createElement(Text, { style: [styles.cell, styles.c3] }, 'Unit'),
          React.createElement(Text, { style: [styles.cell, styles.c4] }, 'Amount'),
        ),
        ...input.items.map((item, idx) =>
          React.createElement(
            View,
            { key: idx, style: styles.tr },
            React.createElement(
              Text,
              { style: [styles.cell, styles.c1] },
              item.reducedTaxRate ? `${item.description} (※軽減税率対象)` : item.description,
            ),
            React.createElement(Text, { style: [styles.cell, styles.c2] }, String(item.quantity)),
            React.createElement(Text, { style: [styles.cell, styles.c3] }, toJpy(item.unitPrice)),
            React.createElement(Text, { style: [styles.cell, styles.c4] }, toJpy(item.unitPrice * item.quantity)),
          ),
        ),
      ),
      React.createElement(
        View,
        { style: { marginTop: 12 } },
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Subtotal / 小計'),
          React.createElement(Text, {}, toJpy(input.amount)),
        ),
        React.createElement(
          View,
          { style: styles.row },
          React.createElement(Text, { style: styles.label }, 'Consumption Tax (10%) / 消費税'),
          React.createElement(Text, {}, toJpy(input.taxAmount)),
        ),
        React.createElement(
          View,
          { style: styles.total },
          React.createElement(Text, { style: { fontWeight: 'bold' } }, 'Total / 合計'),
          React.createElement(Text, { style: { fontWeight: 'bold' } }, toJpy(input.totalAmount)),
        ),
      ),
      input.note
        ? React.createElement(
            View,
            { style: { marginTop: 20 } },
            React.createElement(Text, { style: styles.small }, input.note),
          )
        : null,
      React.createElement(
        View,
        { style: { marginTop: 24 } },
        React.createElement(
          Text,
          { style: styles.small },
          '本書は適格請求書等保存方式（インボイス制度）に準拠します。軽減税率対象品目はありません。',
        ),
      ),
    ),
  )

export const renderInvoicePdf = async (input: InvoicePdfInput): Promise<Uint8Array> => {
  const blob = await pdf(buildDocument(input)).toBlob()
  const buffer = await blob.arrayBuffer()
  return new Uint8Array(buffer)
}
