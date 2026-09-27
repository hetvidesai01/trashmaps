import { X } from 'lucide-react'
import { StatusBadge } from '../common/StatusBadge'
import { formatDateTime } from '../../utils/format'
import type { CollectionPoint, CitizenReport } from '../../types'

interface PointDetailPanelProps {
  point: CollectionPoint
  report: CitizenReport | null
  onClose: () => void
}

export function PointDetailPanel({ point, report, onClose }: PointDetailPanelProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-[500] max-h-[50%] overflow-y-auto rounded-t-2xl border-t border-ink/10 bg-surface p-5 shadow-2xl lg:inset-x-auto lg:top-4 lg:right-4 lg:bottom-auto lg:max-h-[calc(100%-2rem)] lg:w-80 lg:rounded-2xl lg:border">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted">{point.id}</p>
          <p className="font-display text-base font-semibold text-ink">{point.address}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close details"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-3">
        <StatusBadge status={point.status} citizenReported={point.source === 'citizen'} />
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Source</dt>
          <dd className="text-ink">{point.source === 'citizen' ? 'Citizen report' : 'Existing route'}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Requires collection</dt>
          <dd className="text-ink">{point.requiresCollection ? 'Yes' : 'No'}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Last collected</dt>
          <dd className="text-ink">{formatDateTime(point.lastCollected)}</dd>
        </div>
        {point.existingRouteId && (
          <div className="flex items-center justify-between">
            <dt className="text-muted">Existing route ID</dt>
            <dd className="text-ink">{point.existingRouteId}</dd>
          </div>
        )}
      </dl>

      {report && (
        <div className="mt-4 rounded-lg bg-[color-mix(in_srgb,var(--color-status-citizen)_8%,transparent)] p-3">
          <p className="text-xs font-medium text-[color:var(--color-status-citizen)]">
            Originated from a verified citizen report
          </p>
          <dl className="mt-2 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Category</dt>
              <dd className="text-ink">{report.category}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Severity</dt>
              <dd className="text-ink capitalize">{report.severity}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-muted">{report.description}</p>
        </div>
      )}
    </div>
  )
}
