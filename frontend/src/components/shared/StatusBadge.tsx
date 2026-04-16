import { type PropertyStatus, STATUS_LABEL } from '@/data/mock'

const statusStyles: Record<PropertyStatus, string> = {
  reviewing: 'bg-neutral-50 text-neutral-600 border border-neutral-300',
  published: 'bg-primary-500 text-white',
  published_registering: 'bg-warning-50 text-warning-700 border border-warning-500',
  bidding: 'bg-cta-500 text-white',
  bid_ended: 'bg-neutral-400 text-white',
  pending_approval: 'bg-warning-500 text-white',
  closed: 'bg-success-500 text-white',
  returned: 'bg-error-50 text-error-700 border border-error-500',
  failed: 'bg-neutral-50 text-neutral-500 border border-neutral-300',
}

export const StatusBadge = ({ status }: { status: PropertyStatus }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
