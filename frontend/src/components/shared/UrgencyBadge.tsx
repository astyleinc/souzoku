import { type Urgency, URGENCY_LABEL } from '@/data/mock'

const urgencyStyles: Record<Urgency, string> = {
  urgent: 'bg-error-50 text-error-700',
  three_months: 'bg-warning-50 text-warning-700',
  one_year: 'bg-info-50 text-info-700',
  undecided: 'bg-neutral-50 text-neutral-600',
}

export const UrgencyBadge = ({ urgency }: { urgency: Urgency }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${urgencyStyles[urgency]}`}
    >
      {URGENCY_LABEL[urgency]}
    </span>
  )
}
