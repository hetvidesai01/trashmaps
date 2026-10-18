import { useState } from 'react'
import { Check, ImageOff, Loader2, X } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { formatReportedTime } from '../../utils/format'
import type { CitizenReport } from '../../types'

interface PendingReportCardProps {
  report: CitizenReport
  onApprove: (reportId: string) => Promise<void>
  onReject: (reportId: string) => Promise<void>
  onDetails: (report: CitizenReport) => void
}

export function PendingReportCard({ report, onApprove, onReject, onDetails }: PendingReportCardProps) {
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)

  async function run(action: 'approve' | 'reject') {
    setPendingAction(action)
    await (action === 'approve' ? onApprove(report.id) : onReject(report.id))
    setPendingAction(null)
  }

  return (
    <li className="tm-rise">
      <Card className="p-4 sm:p-5">
        <div className="flex gap-4">
          {report.imageUrl ? (
            <img
              src={report.imageUrl}
              alt={`Photo submitted for ${report.category}`}
              className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"
            />
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-sage-soft text-muted sm:h-24 sm:w-24">
              <ImageOff size={24} strokeWidth={1.6} />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-base font-extrabold leading-snug text-ink">{report.address}</p>
            <p className="mt-1 text-sm font-semibold text-muted">
              {report.category} &middot; {formatReportedTime(report.reportedAt)}
            </p>
            <button
              type="button"
              onClick={() => onDetails(report)}
              className="mt-2 text-xs font-bold text-primary underline-offset-2 hover:underline"
            >
              View details
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => run('reject')} disabled={pendingAction !== null}>
            {pendingAction === 'reject' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <X size={16} strokeWidth={2.5} />
                Reject
              </>
            )}
          </Button>
          <Button onClick={() => run('approve')} disabled={pendingAction !== null}>
            {pendingAction === 'approve' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Check size={16} strokeWidth={3} />
                Approve
              </>
            )}
          </Button>
        </div>
      </Card>
    </li>
  )
}
