import { AlertTriangle, Calendar } from 'lucide-react'

type Props = {
  inheritanceStartDate: string | null | undefined
}

type Deadline = {
  label: string
  due: Date
  daysLeft: number
  tone: 'danger' | 'warning' | 'info'
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

// 申告期限10ヶ月・登記期限3年の残日数を計算し、期限に応じた色味で表示する
export const InheritanceDeadlineBanner = ({ inheritanceStartDate }: Props) => {
  if (!inheritanceStartDate) return null

  const start = new Date(inheritanceStartDate)
  if (Number.isNaN(start.getTime())) return null

  const taxDeadline = new Date(start)
  taxDeadline.setMonth(taxDeadline.getMonth() + 10)

  const registrationDeadline = new Date(start)
  registrationDeadline.setFullYear(registrationDeadline.getFullYear() + 3)

  const now = Date.now()
  const daysLeft = (d: Date) => Math.ceil((d.getTime() - now) / MS_PER_DAY)

  const toneFor = (left: number): Deadline['tone'] => {
    if (left < 30) return 'danger'
    if (left < 90) return 'warning'
    return 'info'
  }

  const deadlines: Deadline[] = [
    {
      label: '相続税申告期限（10ヶ月）',
      due: taxDeadline,
      daysLeft: daysLeft(taxDeadline),
      tone: toneFor(daysLeft(taxDeadline)),
    },
    {
      label: '相続登記期限（3年）',
      due: registrationDeadline,
      daysLeft: daysLeft(registrationDeadline),
      tone: toneFor(daysLeft(registrationDeadline)),
    },
  ]

  const toneClass = (tone: Deadline['tone']) => {
    if (tone === 'danger') return 'bg-error-50 border-error-200 text-error-700'
    if (tone === 'warning') return 'bg-warning-50 border-warning-200 text-warning-700'
    return 'bg-info-50 border-info-200 text-info-700'
  }

  return (
    <div className="space-y-2">
      {deadlines.map((d) => (
        <div
          key={d.label}
          className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${toneClass(d.tone)}`}
        >
          {d.tone === 'danger' ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <Calendar className="w-4 h-4 shrink-0" />
          )}
          <div className="flex-1">
            <p className="font-medium">{d.label}</p>
            <p className="text-xs opacity-80">{d.due.toLocaleDateString('ja-JP')} まで</p>
          </div>
          <div className="text-right">
            {d.daysLeft > 0 ? (
              <>
                <p className="text-lg font-semibold leading-none">残り {d.daysLeft.toLocaleString()}</p>
                <p className="text-xs opacity-80 mt-0.5">日</p>
              </>
            ) : (
              <p className="text-sm font-semibold">期限超過</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
