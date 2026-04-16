import { type BidStatus, BID_STATUS_LABEL } from '@/data/mock-dashboard'

const bidStatusStyle: Record<BidStatus, string> = {
  active: 'bg-cta-50 text-cta-700',
  superseded: 'bg-neutral-100 text-neutral-500',
  selected: 'bg-success-50 text-success-700',
  rejected: 'bg-error-50 text-error-700',
  cancelled: 'bg-neutral-100 text-neutral-400',
}

export const BidStatusBadge = ({ status }: { status: BidStatus }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium ${bidStatusStyle[status]}`}
    >
      {BID_STATUS_LABEL[status]}
    </span>
  )
}
