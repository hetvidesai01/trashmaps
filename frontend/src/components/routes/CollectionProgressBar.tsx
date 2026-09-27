import { formatPercent } from '../../utils/format'

interface CollectionProgressBarProps {
  progress: number
  label?: string
}

export function CollectionProgressBar({ progress, label }: CollectionProgressBarProps) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs text-muted">{label}</span>
          <span className="font-display text-sm font-semibold text-primary-dark">
            {formatPercent(progress)}
          </span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}
