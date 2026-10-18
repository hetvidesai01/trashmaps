import type { CSSProperties, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

interface RoleCardProps {
  title: string
  description: string
  /** Illustration; fills a rounded frame (small on phones, large on md+). */
  art: ReactNode
  /** Background tint classes (rest + hover). */
  tintClassName: string
  /** Entrance stagger. */
  delay: number
  onClick: () => void
}

/**
 * Large, fully clickable role card. Phones: compact horizontal card with a
 * thumbnail illustration. md+: tall card with a big illustration on top.
 * Hover lifts it and animates the art + arrow; press scales it down; keyboard
 * focus shows a thick ring. Entire card is one <button>.
 */
export function RoleCard({ title, description, art, tintClassName, delay, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${delay}s`, animationDuration: '0.65s' } as CSSProperties}
      className={`tm-rise tm-role-card group relative flex min-h-[7.5rem] w-full items-center gap-3 overflow-hidden rounded-[1.75rem] border border-white/80 p-3 text-left shadow-card transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:translate-y-0 active:scale-[0.97] md:min-h-0 md:flex-col md:items-stretch md:gap-4 md:p-4 ${tintClassName}`}
    >
      <span className="relative block h-[5.75rem] w-24 shrink-0 overflow-hidden rounded-2xl md:h-44 md:w-full md:rounded-[1.25rem]">
        <span className="tm-card-art absolute inset-0 block">{art}</span>
      </span>

      <span className="min-w-0 flex-1 md:flex-none md:pb-1 md:pr-20">
        <span className="block text-lg font-extrabold leading-tight text-ink md:text-2xl">{title}</span>
        <span className="mt-1 block text-[13px] font-semibold leading-snug text-ink/70 md:mt-1.5 md:text-[15px]">
          {description}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="tm-card-arrow flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-dark text-white shadow-button group-hover:bg-primary md:absolute md:bottom-4 md:right-4 md:h-14 md:w-14"
      >
        <ArrowRight size={24} strokeWidth={2.4} />
      </span>
    </button>
  )
}
