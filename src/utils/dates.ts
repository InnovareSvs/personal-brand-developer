export function get48HoursAgo(): Date {
  const d = new Date()
  d.setHours(d.getHours() - 48)
  return d
}

export function formatReportingPeriod(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  return `${fmt(start)} – ${fmt(end)}`
}

export function isWithin48Hours(date: Date): boolean {
  return date >= get48HoursAgo()
}

export function nextSummaryDue(lastSentAt: Date | null): Date {
  if (!lastSentAt) return new Date()
  const next = new Date(lastSentAt)
  next.setHours(next.getHours() + 48)
  return next
}
