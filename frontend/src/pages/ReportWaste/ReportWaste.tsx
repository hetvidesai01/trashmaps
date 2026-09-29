import { PageContainer } from '../../components/layout/PageContainer'
import { ReportWasteForm } from '../../components/forms/ReportWasteForm'

export function ReportWaste() {
  return (
    <PageContainer className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Report Waste</h1>
      <div className="mt-6">
        <ReportWasteForm />
      </div>
    </PageContainer>
  )
}
