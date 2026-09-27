import type { ReportStatus } from '../../types'

const STAGES: { status: ReportStatus; label: string }[] = [
  { status: 'pending_verification', label: 'Pending verification' },
  { status: 'verified_active', label: 'Verified' },
  { status: 'included_in_route', label: 'Included in route' },
  { status: 'resolved', label: 'Resolved' },
]

interface ReportLifecycleProps {
  status: ReportStatus
}

export function ReportLifecycle({ status }: ReportLifecycleProps) {
  const currentIndex = STAGES.findIndex((stage) => stage.status === status)

  return (
    <ol className="flex items-start">
      {STAGES.map((stage, index) => {
        const isDone = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <li key={stage.status} className="flex flex-1 items-start last:flex-none">
            <div className="flex w-14 flex-col items-center gap-1 text-center">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                  isCurrent
                    ? 'bg-primary text-white'
                    : isDone
                      ? 'bg-primary/15 text-primary-dark'
                      : 'bg-ink/[0.06] text-muted'
                }`}
              >
                {isDone ? '✓' : index + 1}
              </span>
              <span className={`text-[10px] leading-tight ${isCurrent ? 'font-medium text-ink' : 'text-muted'}`}>
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <span
                className={`mt-2.5 h-0.5 flex-1 ${isDone ? 'bg-primary/30' : 'bg-ink/[0.06]'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
