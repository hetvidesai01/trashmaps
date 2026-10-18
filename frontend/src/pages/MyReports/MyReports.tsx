import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { Card } from '../../components/common/Card'
import { StatusBadge } from '../../components/common/StatusBadge'
import { PageContainer } from '../../components/layout/PageContainer'
import { RecycleBin } from '../../components/illustrations'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getCitizenReports } from '../../services/api'
import { formatReportDate } from '../../utils/format'
import type { ReportStatus } from '../../types'

type Filter = 'all' | 'review' | 'approved' | 'collected'

const FILTERS: { id: Filter; label: string; statuses: ReportStatus[] | null }[] = [
  { id: 'all', label: 'All', statuses: null },
  { id: 'review', label: 'Under Review', statuses: ['pending_verification'] },
  { id: 'approved', label: 'Approved', statuses: ['verified_active', 'included_in_route'] },
  { id: 'collected', label: 'Collected', statuses: ['resolved'] },
]

export function MyReports() {
  const { data: reports, isLoading } = useAsyncData(getCitizenReports)
  const [filter, setFilter] = useState<Filter>('all')

  const activeStatuses = FILTERS.find((item) => item.id === filter)?.statuses ?? null
  const visible = reports?.filter((report) => !activeStatuses || activeStatuses.includes(report.status)) ?? []

  return (
    <PageContainer className="max-w-2xl">
      <h1 className="text-3xl font-extrabold text-ink">My Reports</h1>

      <div className="-mx-1 mt-5 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter reports">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`tm-press shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
              filter === item.id ? 'bg-primary-dark text-white shadow-button' : 'bg-surface text-muted hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="mt-6 text-sm font-semibold text-muted">Loading your reports&hellip;</p>}

      {!isLoading && reports?.length === 0 && (
        <Card className="mt-6 px-6 py-8 text-center">
          <div className="mx-auto w-24">
            <RecycleBin />
          </div>
          <p className="mt-2 text-base font-extrabold text-ink">You haven&rsquo;t reported anything yet.</p>
          <Link to="/report" className="mt-2 inline-block text-sm font-bold text-primary-dark hover:underline">
            Report Waste
          </Link>
        </Card>
      )}

      {!isLoading && reports && reports.length > 0 && visible.length === 0 && (
        <p className="mt-6 rounded-2xl bg-sage-soft px-4 py-3 text-sm font-semibold text-primary-dark">
          No reports in this view yet.
        </p>
      )}

      <ul className="mt-5 space-y-3">
        {visible.map((report, index) => (
          <li key={report.id} className="tm-rise" style={{ animationDelay: `${Math.min(index, 8) * 0.04}s` }}>
            <Card className="flex items-center gap-4 p-3 pr-4">
              {report.imageUrl ? (
                <img
                  src={report.imageUrl}
                  alt={`Photo submitted for ${report.category}`}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sage-soft text-muted">
                  <ImageOff size={22} strokeWidth={1.6} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-extrabold text-ink">{report.address}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-muted">{report.category}</p>
                <p className="mt-0.5 text-xs font-semibold text-muted/80">{formatReportDate(report.reportedAt)}</p>
              </div>
              <StatusBadge reportStatus={report.status} />
            </Card>
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
