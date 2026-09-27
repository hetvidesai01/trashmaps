import { useState } from 'react'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import type { CollectionStatus, PointSource, ReportSeverity } from '../../types'
import { type PointFilters, EMPTY_FILTERS } from './pointFilters'

interface FilterBarProps {
  filters: PointFilters
  onChange: (filters: PointFilters) => void
}

const SOURCE_OPTIONS: { value: PointSource; label: string }[] = [
  { value: 'route', label: 'Existing route' },
  { value: 'citizen', label: 'Citizen added' },
]

const STATUS_OPTIONS: { value: CollectionStatus; label: string }[] = [
  { value: 'pending', label: 'Requires collection' },
  { value: 'skipped', label: 'Skipped' },
  { value: 'collected', label: 'Collected' },
]

const SEVERITY_OPTIONS: { value: ReportSeverity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-primary bg-primary text-white'
          : 'border-ink/12 bg-surface text-muted hover:border-primary/40 hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeCount = filters.sources.length + filters.statuses.length + filters.severities.length

  return (
    <div className="rounded-card border border-ink/10 bg-surface">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 lg:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          <SlidersHorizontal size={15} />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary-dark">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown size={16} className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} space-y-3 p-4 lg:block lg:pt-4`}>
        <div className="hidden items-center justify-between lg:flex">
          <span className="flex items-center gap-2 text-sm font-medium text-ink">
            <SlidersHorizontal size={15} />
            Filters
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="text-xs font-medium text-primary-dark hover:underline"
            >
              Clear filters ({activeCount})
            </button>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-xs text-muted">Source</p>
          <div className="flex flex-wrap gap-2">
            {SOURCE_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                active={filters.sources.includes(option.value)}
                onClick={() => onChange({ ...filters, sources: toggle(filters.sources, option.value) })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs text-muted">Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                active={filters.statuses.includes(option.value)}
                onClick={() => onChange({ ...filters, statuses: toggle(filters.statuses, option.value) })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs text-muted">Severity (citizen points)</p>
          <div className="flex flex-wrap gap-2">
            {SEVERITY_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                active={filters.severities.includes(option.value)}
                onClick={() => onChange({ ...filters, severities: toggle(filters.severities, option.value) })}
              />
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange(EMPTY_FILTERS)}
              className="text-xs font-medium text-primary-dark hover:underline"
            >
              Clear filters ({activeCount})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
