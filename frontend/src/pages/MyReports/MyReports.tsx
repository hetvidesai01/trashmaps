import { Link } from 'react-router-dom'
import { StatusBadge } from '../../components/common/StatusBadge'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getCitizenReports } from '../../services/api'
import { formatReportedTime } from '../../utils/format'

export function MyReports() {
  const { data: reports, isLoading } = useAsyncData(getCitizenReports)

  return (
    <PageContainer className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">My Reports</h1>

      {isLoading && <p className="mt-6 text-sm text-muted">Loading your reports&hellip;</p>}

      {!isLoading && reports?.length === 0 && (
        <div className="mt-6 text-sm text-muted">
          <p>You haven&rsquo;t reported anything yet.</p>
          <Link to="/report" className="mt-2 inline-block font-medium text-primary-dark hover:underline">
            Report Waste
          </Link>
        </div>
      )}

      <ul className="mt-6 divide-y divide-ink/[0.08]">
        {reports?.map((report) => (
          <li key={report.id} className="flex items-center gap-4 py-4">
            {report.imageUrl && (
              <img
                src={report.imageUrl}
                alt={`Photo submitted for ${report.category}`}
                className="h-14 w-14 shrink-0 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium text-ink">{report.address}</p>
              <p className="mt-0.5 text-sm text-muted">Submitted {formatReportedTime(report.reportedAt)}</p>
            </div>
            <StatusBadge reportStatus={report.status} />
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
