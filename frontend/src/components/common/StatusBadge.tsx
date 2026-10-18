import {
  STATUS_COLOR,
  STATUS_LABEL,
  CITIZEN_SOURCE_COLOR,
  REPORT_STATUS_COLOR,
  REPORT_STATUS_LABEL,
} from '../../constants/status'
import type { CollectionStatus, ReportStatus } from '../../types'

type StatusBadgeProps =
  | { status: CollectionStatus; citizenReported?: boolean; reportStatus?: never }
  | { reportStatus: ReportStatus; status?: never; citizenReported?: never }

export function StatusBadge(props: StatusBadgeProps) {
  const color = props.reportStatus
    ? REPORT_STATUS_COLOR[props.reportStatus]
    : props.citizenReported
      ? CITIZEN_SOURCE_COLOR
      : STATUS_COLOR[props.status]

  const label = props.reportStatus
    ? REPORT_STATUS_LABEL[props.reportStatus]
    : props.citizenReported
      ? 'Citizen added'
      : STATUS_LABEL[props.status]

  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-bold"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 15%, white)`,
      }}
    >
      {label}
    </span>
  )
}
