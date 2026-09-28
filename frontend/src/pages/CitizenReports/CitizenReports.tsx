import { useEffect, useState } from 'react'
import { Card } from '../../components/common/Card'
import { StatusBadge } from '../../components/common/StatusBadge'
import { ReportLifecycle } from '../../components/common/ReportLifecycle'
import { PendingReportCard } from '../../components/reports/PendingReportCard'
import { ReportReviewModal } from '../../components/reports/ReportReviewModal'
import { PageContainer } from '../../components/layout/PageContainer'
import { getCitizenReports, approveReport, rejectReport } from '../../services/api'
import { formatDateTime } from '../../utils/format'
import type { CitizenReport } from '../../types'

export function CitizenReports() {
  const [reports, setReports] = useState<CitizenReport[] | null>(null)
  const [reviewingReport, setReviewingReport] = useState<CitizenReport | null>(null)

  async function refresh() {
    setReports(await getCitizenReports())
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
        <h1 className="font-display text-2xl font-semibold text-ink">Citizen reports</h1>
        <p className="mt-1 text-sm text-muted">
          Review waste reports submitted by citizens and verify the ones worth adding to the
          collection network.
        </p>
      </header>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Awaiting verification</h2>
          {pendingReports.length > 0 && (
            <span className="rounded-full bg-[#D97706]/10 px-2.5 py-1 text-xs font-medium text-[#D97706]">
              {pendingReports.length} pending
            </span>
          )}
        </div>
        <div className="mt-3 space-y-2">
          {reports === null ? (
            <Card className="p-5 text-sm text-muted">Loading citizen reports&hellip;</Card>
          ) : pendingReports.length === 0 ? (
            <Card className="p-5 text-sm text-muted">No reports waiting on review right now.</Card>
          ) : (
            pendingReports.map((report) => (
              <PendingReportCard key={report.id} report={report} onReview={setReviewingReport} />
            ))
          )}
        </div>
      </section>

      {reviewedReports.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink">Reviewed reports</h2>
          <div className="mt-3 space-y-4">
            {reviewedReports.map((report) => (
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
                      Reported by {report.reportedBy}, submitted {formatDateTime(report.reportedAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-ink/[0.06] pt-4">
                  <ReportLifecycle status={report.status} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {reviewingReport && (
        <ReportReviewModal
          report={reviewingReport}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setReviewingReport(null)}
        />
      )}
    </PageContainer>
  )
}
