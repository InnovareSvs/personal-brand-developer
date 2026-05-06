import { prisma } from '@/db/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPlatformLabel, formatContentType, truncate } from '@/utils/formatting'
import ContentApprovalButtons from '@/components/dashboard/ContentApprovalButtons'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const user = await prisma.userProfile.findFirst()
  const items = user
    ? await prisma.contentItem.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        include: { sourceSignal: true },
      })
    : []

  const drafts = items.filter((i) => i.approvalStatus === 'pending')
  const approved = items.filter((i) => i.approvalStatus === 'approved')
  const published = items.filter((i) => i.status === 'published')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Content Manager</h2>
        <p className="text-slate-500 text-sm mt-1">{items.length} total items · {drafts.length} pending approval</p>
      </div>

      {drafts.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Pending Approval</h3>
          <div className="space-y-4">
            {drafts.map((item) => (
              <Card key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge label={formatPlatformLabel(item.platform)} variant="info" />
                      <Badge label={formatContentType(item.contentType)} />
                      <Badge label="pending" variant="warning" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap mb-3">{truncate(item.body, 300)}</p>
                    <div className="flex gap-4 text-xs text-slate-400">
                      <span>Hook: {item.hookScore.toFixed(1)}</span>
                      <span>Clarity: {item.clarityScore.toFixed(1)}</span>
                      <span>Authority: {item.authorityScore.toFixed(1)}</span>
                      <span>Engagement: {item.engagementScore.toFixed(1)}</span>
                      <span className="font-semibold text-brand-600">Overall: {item.performanceScore.toFixed(1)}/10</span>
                    </div>
                    {item.sourceSignal && (
                      <p className="text-xs text-slate-400 mt-1">Source signal: {item.sourceSignal.topic}</p>
                    )}
                  </div>
                  <ContentApprovalButtons contentId={item.id} />
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {approved.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Approved / Scheduled</h3>
          <div className="space-y-3">
            {approved.map((item) => (
              <Card key={item.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge label={formatPlatformLabel(item.platform)} variant="info" />
                      <Badge label="approved" variant="success" />
                    </div>
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  </div>
                  <p className="text-xs text-slate-400">{item.scheduledTime ? new Date(item.scheduledTime).toLocaleString() : 'Unscheduled'}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {items.length === 0 && (
        <Card>
          <p className="text-sm text-slate-400">No content generated yet. Run the agents from the dashboard to start creating content from signals.</p>
        </Card>
      )}
    </div>
  )
}
