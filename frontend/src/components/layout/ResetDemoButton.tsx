import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { resetDemoData } from '../../services/mock/storage'

interface ResetDemoButtonProps {
  iconColorClassName?: string
}

/**
 * Prototype-only utility: clears persisted demo state and reloads, so a
 * faculty demo can be repeated from a clean slate without a real backend.
 */
export function ResetDemoButton({ iconColorClassName = 'text-white/50' }: ResetDemoButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  if (isConfirming) {
    return (
      <div className="absolute right-0 top-full z-[600] mt-2 w-60 rounded-lg border border-ink/10 bg-surface p-3 text-left shadow-xl">
        <p className="text-xs text-ink">Reset all demo data back to the starting dataset?</p>
        <p className="mt-1 text-xs text-muted">This clears submitted reports and approvals.</p>
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-ink/5 hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              resetDemoData()
              window.location.reload()
            }}
            className="rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
          >
            Reset
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      aria-label="Reset demo data"
      title="Reset demo data"
      className={`flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 hover:text-white ${iconColorClassName}`}
    >
      <RotateCcw size={15} />
    </button>
  )
}
