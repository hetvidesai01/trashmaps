import { PageContainer } from '../../components/layout/PageContainer'
import { ReportWasteForm } from '../../components/forms/ReportWasteForm'
import { CitizenReporter } from '../../components/illustrations'

export function ReportWaste() {
  return (
    <PageContainer className="max-w-xl">
      <div className="h-60 overflow-hidden rounded-card shadow-card">
        <CitizenReporter />
      </div>
      <header className="py-6 text-center">
        <h1 className="text-3xl font-extrabold leading-tight text-ink">
          Spot waste?
          <br />
          Report it in seconds.
        </h1>
        <p className="mt-2 text-sm font-semibold text-muted">
          Help us keep the city clean. Your report makes a difference!
        </p>
      </header>
      <ReportWasteForm />
    </PageContainer>
  )
}
