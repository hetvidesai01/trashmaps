import { useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'
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
    <div
      className="tm-fade fixed inset-0 z-[1000] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Review report: ${report.category}`}
    >
      <div className="tm-rise max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-[1.75rem] bg-surface p-6 shadow-lift sm:rounded-[1.75rem]">
        {outcome ? (
          <div className="py-4 text-center">
            <span
              className={`tm-pop mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white ${
                outcome === 'approved' ? 'bg-primary' : 'bg-muted'
              }`}
            >
              {outcome === 'approved' ? <Check size={30} strokeWidth={3} /> : <X size={30} strokeWidth={3} />}
            </span>
            <p className="mt-4 text-xl font-extrabold text-ink">
              {outcome === 'approved' ? 'Report approved' : 'Report rejected'}
            </p>
            <p className="mx-auto mt-1.5 max-w-xs text-sm font-semibold text-muted">
              {outcome === 'approved'
                ? 'This stop is now eligible to be added to a collection route.'
                : 'This report will not be added to a collection route.'}
            </p>
            <Button className="mt-6 px-8" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-extrabold text-ink">{report.category}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-2">
              <StatusBadge reportStatus={report.status} />
            </div>

            {report.imageUrl && (
              <img
                src={report.imageUrl}
                alt={`Photo submitted for ${report.category}`}
                className="mt-4 h-44 w-full rounded-2xl object-cover"
              />
            )}

            {report.description && <p className="mt-4 text-sm font-semibold text-ink">{report.description}</p>}

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="font-semibold text-muted">Location</dt>
                <dd className="text-right font-bold text-ink">{report.address}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="font-semibold text-muted">Reported by</dt>
                <dd className="text-right font-bold text-ink">{report.reportedBy}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="font-semibold text-muted">Submitted</dt>
                <dd className="text-right font-bold text-ink">{formatDateTime(report.reportedAt)}</dd>
              </div>
            </dl>

            <div className="relative isolate mt-4 h-36 overflow-hidden rounded-2xl border border-line">
              <MapView center={[report.latitude, report.longitude]} zoom={15} scrollWheelZoom={false}>
                <LocationPicker position={[report.latitude, report.longitude]} onChange={() => {}} />
              </MapView>
            </div>

            {report.status === 'pending_verification' ? (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={handleReject} disabled={pendingAction !== null}>
                  {pendingAction === 'reject' ? <Loader2 size={16} className="animate-spin" /> : 'Reject'}
                </Button>
                <Button onClick={handleApprove} disabled={pendingAction !== null}>
                  {pendingAction === 'approve' ? <Loader2 size={16} className="animate-spin" /> : 'Approve'}
                </Button>
              </div>
            ) : (
              <p className="mt-6 text-center text-xs font-semibold text-muted">This report has already been reviewed.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
