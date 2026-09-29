import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '../common/Button'
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
    <li className="flex flex-wrap items-center gap-4 py-5">
      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt={`Photo submitted for ${report.category}`}
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
        />
      )}

      <div className="min-w-0 flex-1 basis-56">
        <p className="text-base font-medium text-ink">{report.address}</p>
        <p className="mt-0.5 text-sm text-muted">
          {report.category} &middot; {formatReportedTime(report.reportedAt)}
        </p>
        <button
          type="button"
          onClick={() => onDetails(report)}
          className="mt-1 text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
        >
          Details
        </button>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" onClick={() => run('reject')} disabled={pendingAction !== null}>
          {pendingAction === 'reject' ? <Loader2 size={15} className="animate-spin" /> : 'Reject'}
        </Button>
        <Button onClick={() => run('approve')} disabled={pendingAction !== null}>
          {pendingAction === 'approve' ? <Loader2 size={15} className="animate-spin" /> : 'Approve'}
        </Button>
      </div>
    </li>
  )
}
