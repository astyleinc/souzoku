import { CheckCircle, Clock, AlertCircle } from 'lucide-react'

type PaymentStatus = 'paid' | 'invoiced' | 'unpaid'

const paymentStatusConfig: Record<PaymentStatus, { label: string; bg: string }> = {
  paid: { label: '入金確認済み', bg: 'bg-success-50 text-success-700' },
  invoiced: { label: '請求済み', bg: 'bg-warning-50 text-warning-700' },
  unpaid: { label: '未請求', bg: 'bg-neutral-50 text-neutral-500' },
}

const paymentIcon: Record<PaymentStatus, React.ReactNode> = {
  paid: <CheckCircle className="w-3.5 h-3.5" />,
  invoiced: <Clock className="w-3.5 h-3.5" />,
  unpaid: <AlertCircle className="w-3.5 h-3.5" />,
}

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const config = paymentStatusConfig[status]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}
    >
      {paymentIcon[status]}
      {config.label}
    </span>
  )
}
