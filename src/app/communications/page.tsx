import { prisma } from '@/db/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPlatformLabel, truncate } from '@/utils/formatting'

export const dynamic = 'force-dynamic'

export default async function CommunicationsPage() {
  const user = await prisma.userProfile.findFirst()

  const [engagementActions, relationships, scheduledContent] = user
    ? await Promise.all([
        prisma.engagementAction.findMany({
          where: { userId: user.id },
          orderBy: { priorityScore: 'desc' },
          take: 20,
        }),
        prisma.relationship.findMany({
          where: { userId: user.id },
          orderBy: { priorityScore: 'desc' },
          take: 10,
        }),
        prisma.contentItem.findMany({
          where: { userId: user.id, approvalStatus: 'approved' },
          orderBy: { scheduledTime: 'asc' },
          take: 10,
        }),
      ])
    : [[], [], []]

  const pending = engagementActions.filter((a) => a.status === 'pending')
  const completed = engagementActions.filter((a) => a.status === 'completed')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Communications Manager</h2>
        <p className="text-slate-500 text-sm mt-1">Lead orchestrator — posting queue, engagement, and relationships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Posting Queue">
          {scheduledContent.length === 0 ? (
            <p className="text-sm text-slate-400">No content scheduled. Approve content in Content Manager first.</p>
          ) : (
            <ul className="space-y-3">
              {scheduledContent.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{truncate(c.title, 50)}</p>
                    <p className="text-xs text-slate-400">{formatPlatformLabel(c.platform)}</p>
                  </div>
                  <Badge label="scheduled" variant="success" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Engagement Queue">
          {pending.length === 0 ? (
            <p className="text-sm text-slate-400">No pending engagement actions.</p>
          ) : (
            <ul className="space-y-3">
              {pending.map((a) => (
                <li key={a.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Badge label={a.actionType} variant="info" />
                    <Badge label={formatPlatformLabel(a.platform)} />
                    {a.requiresReview && <Badge label="review required" variant="warning" />}
                  </div>
                  {a.targetName && <p className="text-xs text-slate-600">Target: {a.targetName}</p>}
                  {a.generatedResponse && (
                    <p className="text-xs text-slate-500 mt-1 italic">{truncate(a.generatedResponse, 80)}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Relationship Opportunities">
          {relationships.length === 0 ? (
            <p className="text-sm text-slate-400">No relationships tracked yet.</p>
          ) : (
            <ul className="space-y-3">
              {relationships.map((r) => (
                <li key={r.id}>
                  <p className="text-sm font-medium text-slate-800">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.role ?? ''} {r.organization ? `· ${r.organization}` : ''} · {formatPlatformLabel(r.platform)}</p>
                  {r.recommendedNextAction && <p className="text-xs text-brand-600 mt-0.5">{r.recommendedNextAction}</p>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Completed Engagements">
          {completed.length === 0 ? (
            <p className="text-sm text-slate-400">No completed actions yet.</p>
          ) : (
            <ul className="space-y-2">
              {completed.slice(0, 8).map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  <Badge label={a.actionType} variant="success" />
                  <span className="text-xs text-slate-500">{formatPlatformLabel(a.platform)}</span>
                  {a.targetName && <span className="text-xs text-slate-400">· {a.targetName}</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}
