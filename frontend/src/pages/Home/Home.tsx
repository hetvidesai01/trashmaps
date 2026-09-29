import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import { RouteArt } from './RouteArt'

const STEPS = ['Normal route', 'Skip stops that don’t need pickup', 'Add citizen reports', 'Shorter route']

export function Home() {
  const { role } = useAuth()

  return (
    <PageContainer>
      <section className="grid items-center gap-12 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <div>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] text-ink lg:text-5xl">
            Collect only where it matters.
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            TrashMaps helps a collection vehicle visit only the places that actually need
            collection, instead of every stop on its normal route.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={role ? ROLE_HOME[role] : '/login'}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              {role ? 'Continue' : 'Log in'}
              <ArrowRight size={15} />
            </Link>
          </div>

          <ol className="mt-12 space-y-2 text-sm text-muted">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary-dark">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex h-72 items-center justify-center lg:h-80">
          <RouteArt />
        </div>
      </section>
    </PageContainer>
  )
}
