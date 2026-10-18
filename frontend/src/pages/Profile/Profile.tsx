import { useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck, Users } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageContainer } from '../../components/layout/PageContainer'
import { ResetDemoButton } from '../../components/layout/ResetDemoButton'
import { LeafMark } from '../../components/illustrations'
import { useAuth } from '../../auth/AuthContext'

const ROLE_COPY = {
  authority: { label: 'Waste management authority', icon: ShieldCheck },
  citizen: { label: 'Citizen', icon: Users },
} as const

export function Profile() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  if (!user || !role) return null
  const { label, icon: RoleIcon } = ROLE_COPY[role]

  return (
    <PageContainer className="max-w-xl">
      <h1 className="text-3xl font-extrabold text-ink">Profile</h1>

      <Card className="mt-5 flex items-center gap-4 p-5">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sage text-2xl font-extrabold text-primary-dark">
          {user.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-extrabold text-ink">{user.name}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1 text-xs font-bold text-primary-dark">
            <RoleIcon size={13} />
            {label}
          </p>
        </div>
      </Card>

      <p className="mt-3 flex items-start gap-2 px-1 text-xs font-semibold leading-relaxed text-muted">
        <LeafMark className="mt-0.5 h-4 w-4 shrink-0" />
        This is a prototype account. Signing in as a role here does not grant real permissions.
      </p>

      <div className="mt-6 space-y-3">
        <Card className="flex items-center justify-between gap-3 px-5 py-3">
          <div>
            <p className="text-sm font-extrabold text-ink">Reset demo data</p>
            <p className="text-xs font-semibold text-muted">Clears reports and approvals you created.</p>
          </div>
          <ResetDemoButton popoverClassName="right-0 bottom-full mb-2" />
        </Card>

        <Button
          variant="secondary"
          className="w-full py-4"
          onClick={() => {
            logout()
            navigate('/login', { replace: true })
          }}
        >
          <LogOut size={17} />
          Log out
        </Button>
      </div>
    </PageContainer>
  )
}
