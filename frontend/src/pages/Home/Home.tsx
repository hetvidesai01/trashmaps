import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import { RouteArt } from './RouteArt'
import { Landing } from '../Landing'

const STEPS = ['Normal route', 'Skip stops that don’t need pickup', 'Add citizen reports', 'Shorter route']

export function Home() {
  const { role } = useAuth()
  const navigate = useNavigate()

  if (!role) {
    return <Landing onSelect={(chosen) => navigate('/login', { state: { mode: chosen } })} />
  }

  return (
    <PageContainer>
      <section className="grid items-center gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <div>
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.1] text-primary-dark lg:text-5xl">
            Collect only where it matters.
          </h1>
          <p className="mt-5 max-w-md text-[17px] font-semibold leading-relaxed text-muted">
            TrashMaps helps a collection vehicle visit only the places that actually need
            collection, instead of every stop on its normal route.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={role ? ROLE_HOME[role] : '/login'}
              className="tm-press inline-flex items-center gap-2 rounded-2xl bg-primary-dark px-6 py-3.5 text-sm font-bold text-white shadow-button hover:bg-primary"
            >
              {role ? 'Continue' : 'Log in'}
              <ArrowRight size={16} />
            </Link>
          </div>

          <ol className="mt-12 space-y-2.5 text-sm font-semibold text-muted">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-extrabold text-primary-dark">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex h-72 items-center justify-center rounded-[2rem] bg-sage-soft lg:h-80">
          <RouteArt />
        </div>
      </section>
    </PageContainer>
  )
}
