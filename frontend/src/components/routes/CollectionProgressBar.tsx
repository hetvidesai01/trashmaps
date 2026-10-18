import { formatPercent } from '../../utils/format'

interface CollectionProgressBarProps {
  progress: number
  label?: string
  /** 'onDark' renders a pale track + fill for use on the deep-green hero card. */
  tone?: 'default' | 'onDark'
}

export function CollectionProgressBar({ progress, label, tone = 'default' }: CollectionProgressBarProps) {
  const onDark = tone === 'onDark'
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className={`text-xs font-semibold ${onDark ? 'text-white/75' : 'text-muted'}`}>{label}</span>
          <span className={`font-display text-sm font-semibold ${onDark ? 'text-white' : 'text-primary-dark'}`}>
            {formatPercent(progress)}
          </span>
        </div>
      )}
      <div
        className={`h-2.5 w-full overflow-hidden rounded-full ${onDark ? 'bg-white/20' : 'bg-ink/[0.08]'}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${onDark ? 'bg-accent' : 'bg-primary'}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
