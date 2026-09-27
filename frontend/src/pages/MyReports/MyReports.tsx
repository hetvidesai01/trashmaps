import { Card } from '../../components/common/Card'
import { StatusBadge } from '../../components/common/StatusBadge'
import { ReportLifecycle } from '../../components/common/ReportLifecycle'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getCitizenReports } from '../../services/api'
import { formatDateTime } from '../../utils/format'

export function MyReports() {
  const { data: reports } = useAsyncData(getCitizenReports)

  return (
    <PageContainer className="max-w-2xl">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">My reports</h1>
        <p className="mt-1 text-sm text-muted">Waste reports you&rsquo;ve submitted and their review status.</p>
      </header>

      <div className="mt-6 space-y-4">
        {reports?.map((report) => (
          <Card key={report.id} className="p-4">
            <div className="flex gap-3">
              {report.imageUrl && (
                <img
                  src={report.imageUrl}
                  alt={`Photo submitted for ${report.category}`}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{report.category}</p>
                    <p className="truncate text-xs text-muted">{report.address}</p>
                  </div>
                  <StatusBadge reportStatus={report.status} />
                </div>
                <p className="mt-1.5 text-sm text-muted">{report.description}</p>
                <p className="mt-2 text-xs text-muted">
                  {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)} severity,
                  submitted {formatDateTime(report.reportedAt)}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-ink/[0.06] pt-4">
              <ReportLifecycle status={report.status} />
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
