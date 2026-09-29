import { useState } from 'react'
import { CircleCheck, CircleX, Loader2, X } from 'lucide-react'
import { Button } from '../common/Button'
import { StatusBadge } from '../common/StatusBadge'
import { MapView } from '../map/MapView'
import { LocationPicker } from '../map/LocationPicker'
import { formatDateTime } from '../../utils/format'
import type { CitizenReport } from '../../types'

interface ReportReviewModalProps {
  report: CitizenReport
  onApprove: (reportId: string) => Promise<void>
  onReject: (reportId: string) => Promise<void>
  onClose: () => void
}

export function ReportReviewModal({ report, onApprove, onReject, onClose }: ReportReviewModalProps) {
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)
  const [outcome, setOutcome] = useState<'approved' | 'rejected' | null>(null)

  async function handleApprove() {
    setPendingAction('approve')
    await onApprove(report.id)
    setPendingAction(null)
    setOutcome('approved')
  }

  async function handleReject() {
    setPendingAction('reject')
    await onReject(report.id)
    setPendingAction(null)
    setOutcome('rejected')
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-card bg-surface p-6 shadow-2xl">
        {outcome ? (
          <div className="py-4 text-center">
            {outcome === 'approved' ? (
              <CircleCheck className="mx-auto text-primary" size={36} strokeWidth={1.5} />
            ) : (
              <CircleX className="mx-auto text-muted" size={36} strokeWidth={1.5} />
            )}
            <p className="mt-3 font-display text-lg font-semibold text-ink">
              {outcome === 'approved' ? 'Report approved' : 'Report rejected'}
            </p>
            <p className="mx-auto mt-1.5 max-w-xs text-sm text-muted">
              {outcome === 'approved'
                ? 'This stop is now eligible to be added to a collection route.'
                : 'This report will not be added to a collection route.'}
            </p>
            <Button className="mt-6" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">{report.category}</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-2">
              <StatusBadge reportStatus={report.status} />
            </div>

            {report.imageUrl && (
              <img
                src={report.imageUrl}
                alt={`Photo submitted for ${report.category}`}
                className="mt-4 h-40 w-full rounded-lg object-cover"
              />
            )}

            {report.description && <p className="mt-4 text-sm text-ink">{report.description}</p>}

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Location</dt>
                <dd className="text-ink">{report.address}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Reported by</dt>
                <dd className="text-ink">{report.reportedBy}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Submitted</dt>
                <dd className="text-ink">{formatDateTime(report.reportedAt)}</dd>
              </div>
            </dl>

            <div className="mt-4 h-36 overflow-hidden rounded-lg border border-ink/10">
              <MapView center={[report.latitude, report.longitude]} zoom={15} scrollWheelZoom={false}>
                <LocationPicker position={[report.latitude, report.longitude]} onChange={() => {}} />
              </MapView>
            </div>

            {report.status === 'pending_verification' ? (
              <div className="mt-6 flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1 justify-center"
                  onClick={handleReject}
                  disabled={pendingAction !== null}
                >
                  {pendingAction === 'reject' ? <Loader2 size={15} className="animate-spin" /> : 'Reject'}
                </Button>
                <Button className="flex-1 justify-center" onClick={handleApprove} disabled={pendingAction !== null}>
                  {pendingAction === 'approve' ? <Loader2 size={15} className="animate-spin" /> : 'Approve'}
                </Button>
              </div>
            ) : (
              <p className="mt-6 text-center text-xs text-muted">This report has already been reviewed.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
