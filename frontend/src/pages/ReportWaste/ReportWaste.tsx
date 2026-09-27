import { PageContainer } from '../../components/layout/PageContainer'
import { ReportWasteForm } from '../../components/forms/ReportWasteForm'

export function ReportWaste() {
  return (
    <PageContainer className="max-w-xl">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Report waste</h1>
        <p className="mt-1 text-sm text-muted">
          Spotted waste outside the regular route? Flag it here so it can be verified and added
          to the collection set.
        </p>
      </header>
      <div className="mt-6">
        <ReportWasteForm />
      </div>
    </PageContainer>
  )
}
