import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { PageContainer } from '../../components/layout/PageContainer'
import { ReportWasteForm } from '../../components/forms/ReportWasteForm'
import { CitizenReporter } from '../../components/illustrations'

function scrollToForm() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById('report-form')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
}

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
        <Button className="mt-5 w-full py-4 text-base" onClick={scrollToForm}>
          Report Waste
          <ArrowRight size={18} />
        </Button>
      </header>
      <div id="report-form" className="scroll-mt-20">
        <ReportWasteForm />
      </div>
    </PageContainer>
  )
}
