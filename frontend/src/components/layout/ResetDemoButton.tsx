import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { resetDemoData } from '../../services/mock/storage'

interface ResetDemoButtonProps {
  /** Classes for the trigger button (colour/size). */
  className?: string
  /** Where the confirmation popover sits relative to the trigger. */
  popoverClassName?: string
  label?: string
}

/**
 * Prototype-only utility: clears persisted demo state and reloads, so a
 * faculty demo can be repeated from a clean slate without a real backend.
 */
export function ResetDemoButton({
  className = 'h-11 w-11 text-muted hover:bg-ink/5 hover:text-ink',
  popoverClassName = 'right-0 top-full mt-2',
  label,
}: ResetDemoButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsConfirming((open) => !open)}
        aria-label="Reset demo data"
        title="Reset demo data"
        className={`flex items-center justify-center gap-2 rounded-xl transition-colors ${className}`}
      >
        <RotateCcw size={15} />
        {label}
      </button>

      {isConfirming && (
        <div
          className={`absolute z-[950] w-64 rounded-2xl border border-line bg-surface p-4 text-left shadow-lift ${popoverClassName}`}
        >
          <p className="text-sm font-semibold text-ink">Reset all demo data back to the starting dataset?</p>
          <p className="mt-1 text-xs text-muted">This clears submitted reports and approvals.</p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              className="rounded-xl px-3 py-1.5 text-xs font-bold text-muted hover:bg-ink/5 hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                resetDemoData()
                window.location.reload()
              }}
              className="rounded-xl bg-primary-dark px-3 py-1.5 text-xs font-bold text-white hover:bg-primary"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
