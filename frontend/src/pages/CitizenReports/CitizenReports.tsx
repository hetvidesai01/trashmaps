import { useEffect, useState } from 'react'
import { Card } from '../../components/common/Card'
import { StatusBadge } from '../../components/common/StatusBadge'
import { PendingReportCard } from '../../components/reports/PendingReportCard'
import { ReportReviewModal } from '../../components/reports/ReportReviewModal'
import { PageContainer } from '../../components/layout/PageContainer'
import { RecycleBin } from '../../components/illustrations'
import { getCitizenReports, approveReport, rejectReport } from '../../services/api'
import { formatReportedTime } from '../../utils/format'
import type { CitizenReport } from '../../types'

export function CitizenReports() {
  const [reports, setReports] = useState<CitizenReport[] | null>(null)
  const [detailsReport, setDetailsReport] = useState<CitizenReport | null>(null)

  async function refresh() {
    // Spread so React sees a new array — the mock store is mutated in place.
    setReports([...(await getCitizenReports())])
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleApprove(reportId: string) {
    await approveReport(reportId)
    await refresh()
  }

  async function handleReject(reportId: string) {
    await rejectReport(reportId)
    await refresh()
  }

  const pendingReports = reports?.filter((report) => report.status === 'pending_verification') ?? []
  const reviewedReports = reports?.filter((report) => report.status !== 'pending_verification') ?? []

  return (
    <PageContainer className="max-w-3xl">
      <header>
        <h1 className="text-3xl font-extrabold text-ink">Citizen Reports</h1>
        <p className="mt-1 text-sm font-semibold text-muted">
          {reports === null
            ? 'Loading reports…'
            : pendingReports.length === 0
              ? 'Nothing is waiting for review.'
              : `${pendingReports.length} ${pendingReports.length === 1 ? 'report' : 'reports'} awaiting verification.`}
        </p>
      </header>

      <section className="mt-6" aria-label="Reports awaiting verification">
        {reports !== null && pendingReports.length === 0 ? (
          <Card className="px-6 py-8 text-center">
            <div className="mx-auto w-24">
              <RecycleBin />
            </div>
            <p className="mt-2 text-base font-extrabold text-ink">All caught up</p>
            <p className="text-sm font-semibold text-muted">No reports waiting for review.</p>
          </Card>
        ) : (
          <ul className="space-y-4">
            {pendingReports.map((report) => (
              <PendingReportCard
                key={report.id}
                report={report}
                onApprove={handleApprove}
                onReject={handleReject}
                onDetails={setDetailsReport}
              />
            ))}
          </ul>
        )}
      </section>

      {reviewedReports.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-extrabold text-muted">Reviewed</h2>
          <ul className="mt-3 space-y-2.5">
            {reviewedReports.map((report) => (
              <li key={report.id}>
                <Card className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-ink">{report.address}</p>
                    <p className="text-xs font-semibold text-muted">
                      {report.category} &middot; {formatReportedTime(report.reportedAt)}
                    </p>
                  </div>
                  <StatusBadge reportStatus={report.status} />
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {detailsReport && (
        <ReportReviewModal
          report={detailsReport}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setDetailsReport(null)}
        />
      )}
    </PageContainer>
  )
}
