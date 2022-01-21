import { OperationStatus } from '../Enums'

export function statusFromDates(
  start: string | undefined,
  end: string | undefined
): OperationStatus {
  if (start === undefined || end === undefined) return OperationStatus.UNKNOWN

  const startDate = new Date(start)
  const endDate = new Date(end)
  const now = new Date()

  if (endDate < now) return OperationStatus.CONCLUDED
  if (startDate > now) return OperationStatus.UPCOMING

  return OperationStatus.ONGOING
}
