import { useEffect, useState } from 'react'
import { StatusBadge } from '../../components/common/StatusBadge'
import { PendingReportCard } from '../../components/reports/PendingReportCard'
import { ReportReviewModal } from '../../components/reports/ReportReviewModal'
import { PageContainer } from '../../components/layout/PageContainer'
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
      <h1 className="font-display text-2xl font-semibold text-ink">Citizen Reports</h1>

      <section className="mt-6">
        {reports === null ? (
          <p className="text-sm text-muted">Loading reports&hellip;</p>
        ) : pendingReports.length === 0 ? (
          <p className="rounded-lg bg-ink/[0.04] px-4 py-3 text-sm text-muted">No reports waiting for review.</p>
        ) : (
          <ul className="divide-y divide-ink/[0.08]">
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
        <section className="mt-12">
          <h2 className="text-sm font-semibold text-muted">Reviewed</h2>
          <ul className="mt-2 divide-y divide-ink/[0.06]">
            {reviewedReports.map((report) => (
              <li key={report.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{report.address}</p>
                  <p className="text-xs text-muted">
                    {report.category} &middot; {formatReportedTime(report.reportedAt)}
                  </p>
                </div>
                <StatusBadge reportStatus={report.status} />
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
