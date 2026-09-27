import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { formatDateTime } from '../../utils/format'
import type { CitizenReport } from '../../types'

interface PendingReportCardProps {
  report: CitizenReport
  onReview: (report: CitizenReport) => void
}

export function PendingReportCard({ report, onReview }: PendingReportCardProps) {
  return (
    <Card className="flex gap-3 p-3.5">
      {report.imageUrl && (
        <img
          src={report.imageUrl}
          alt={`Photo submitted for ${report.category}`}
          className="h-14 w-14 shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{report.category}</p>
        <p className="truncate text-xs text-muted">{report.address}</p>
        <p className="mt-1 line-clamp-1 text-xs text-muted">{report.description}</p>
        <p className="mt-1 text-xs text-muted">
          {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)} severity, submitted{' '}
          {formatDateTime(report.reportedAt)}
        </p>
      </div>
      <Button variant="secondary" onClick={() => onReview(report)} className="shrink-0 self-center">
        Review
      </Button>
    </Card>
  )
}
