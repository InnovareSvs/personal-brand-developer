/**
 * Scheduler Service
 *
 * In production: replace with BullMQ, Celery, or a managed cron service.
 * This module provides a lightweight in-process scheduler for development and MVP.
 */

type ScheduledJob = {
  id: string
  intervalMs: number
  handler: () => Promise<void>
  lastRun?: Date
  timer?: ReturnType<typeof setInterval>
}

const jobs = new Map<string, ScheduledJob>()

export function registerJob(id: string, intervalMs: number, handler: () => Promise<void>) {
  if (jobs.has(id)) return

  const job: ScheduledJob = { id, intervalMs, handler }
  job.timer = setInterval(async () => {
    try {
      await handler()
      job.lastRun = new Date()
    } catch (err) {
      console.error(`[Scheduler] Job ${id} failed:`, err)
    }
  }, intervalMs)

  jobs.set(id, job)
  console.log(`[Scheduler] Registered job: ${id} every ${intervalMs / 1000}s`)
}

export function unregisterJob(id: string) {
  const job = jobs.get(id)
  if (job?.timer) clearInterval(job.timer)
  jobs.delete(id)
}

export function listJobs() {
  return Array.from(jobs.values()).map(({ id, intervalMs, lastRun }) => ({ id, intervalMs, lastRun }))
}
