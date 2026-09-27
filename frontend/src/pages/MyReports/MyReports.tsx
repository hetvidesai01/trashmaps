import { Card } from '../../components/common/Card'
import { StatusBadge } from '../../components/common/StatusBadge'
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

      <div className="mt-6 space-y-3">
        {reports?.map((report) => (
          <Card key={report.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{report.category}</p>
                <p className="mt-1 text-sm text-muted">{report.description}</p>
              </div>
              <StatusBadge reportStatus={report.status} />
            </div>
            <p className="mt-3 text-xs text-muted">Submitted {formatDateTime(report.reportedAt)}</p>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
