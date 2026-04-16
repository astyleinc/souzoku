import { type CaseStatus, CASE_STATUS_LABEL } from '@/data/mock-dashboard'

const caseStatusStyle: Record<CaseStatus, string> = {
  broker_assigned: 'bg-info-50 text-info-700',
  seller_contacted: 'bg-primary-50 text-primary-700',
  buyer_contacted: 'bg-primary-50 text-primary-700',
  explanation_done: 'bg-warning-50 text-warning-700',
  contract_signed: 'bg-cta-50 text-cta-700',
  settlement_done: 'bg-success-50 text-success-700',
  cancelled: 'bg-error-50 text-error-700',
}

export const CaseStatusBadge = ({ status }: { status: CaseStatus }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${caseStatusStyle[status]}`}
    >
      {CASE_STATUS_LABEL[status]}
    </span>
  )
}
