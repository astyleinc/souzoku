import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { VERIFICATION_STATUS_LABEL } from '@/data/mock-dashboard'

type VerificationStatus = 'pending' | 'verified' | 'rejected'

const verificationStatusStyle: Record<VerificationStatus, string> = {
  pending: 'bg-warning-50 text-warning-700',
  verified: 'bg-success-50 text-success-700',
  rejected: 'bg-error-50 text-error-700',
}

const verificationIcon: Record<VerificationStatus, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  verified: <CheckCircle className="w-3.5 h-3.5" />,
  rejected: <XCircle className="w-3.5 h-3.5" />,
}

export const VerificationStatusBadge = ({ status }: { status: VerificationStatus }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${verificationStatusStyle[status]}`}
    >
      {verificationIcon[status]}
      {VERIFICATION_STATUS_LABEL[status]}
    </span>
  )
}
