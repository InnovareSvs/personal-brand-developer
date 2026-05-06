import { prisma } from '@/db/client'
import { getBrandScore } from '@/services/analytics.service'
import { StatCard, Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { truncate, formatPlatformLabel } from '@/utils/formatting'
import RunAgentsButton from '@/components/dashboard/RunAgentsButton'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const user = await prisma.userProfile.findFirst()
  if (!user) return null

  const [brandScore, signals, pendingContent, opportunities, reviewItems] = await Promise.all([
    getBrandScore(user.id),
    prisma.signal.findMany({ where: { userId: user.id, status: 'new' }, orderBy: { compositeScore: 'desc' }, take: 5 }),
    prisma.contentItem.findMany({ where: { userId: user.id, approvalStatus: 'pending' }, orderBy: { performanceScore: 'desc' }, take: 5 }),
    prisma.opportunity.findMany({ where: { userId: user.id, status: 'new' }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.engagementAction.count({ where: { userId: user.id, requiresReview: true, status: 'pending' } }),
  ])

  return { user, brandScore, signals, pendingContent, opportunities, reviewItems }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to Personal Brand Developer</h2>
        <p className="text-slate-500 mb-6">Set up your profile in Settings to get started.</p>
        <a href="/settings" className="inline-block bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
          Set Up Profile
        </a>
      </div>
    )
  }

  const { user, brandScore, signals, pendingContent, opportunities, reviewItems } = data

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
          <p className="text-slate-500 text-sm mt-1">{user.industry} · {user.approvalPreferences} mode</p>
        </div>
        <RunAgentsButton userId={user.id} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Brand Score" value={brandScore} sub="out of 100" />
        <StatCard label="New Signals" value={signals.length} sub="awaiting action" />
        <StatCard label="Pending Content" value={pendingContent.length} sub="needs approval" />
        <StatCard label="Review Required" value={reviewItems} sub="engagement actions" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Top Signals">
          {signals.length === 0 ? (
            <p className="text-sm text-slate-400">No signals yet. Run the agents to collect intelligence.</p>
          ) : (
            <ul className="space-y-3">
              {signals.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{s.topic}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{truncate(s.summary, 80)}</p>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 shrink-0">{(s.compositeScore * 100).toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Scheduled Content">
          {pendingContent.length === 0 ? (
            <p className="text-sm text-slate-400">No content pending approval.</p>
          ) : (
            <ul className="space-y-3">
              {pendingContent.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{truncate(c.title, 60)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatPlatformLabel(c.platform)} · {c.contentType}</p>
                  </div>
                  <Badge label="pending" variant="warning" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Inbound Opportunities">
          {opportunities.length === 0 ? (
            <p className="text-sm text-slate-400">No opportunities detected yet.</p>
          ) : (
            <ul className="space-y-3">
              {opportunities.map((o) => (
                <li key={o.id}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-800">{o.opportunityType}</p>
                    <Badge label={o.priority} variant={o.priority === 'high' ? 'danger' : o.priority === 'medium' ? 'warning' : 'default'} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{truncate(o.summary, 80)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Actions Requiring Review">
          <p className="text-sm text-slate-700">
            <span className="text-2xl font-bold text-slate-900">{reviewItems}</span> engagement actions need review.
          </p>
          <a href="/communications" className="mt-3 inline-block text-xs text-brand-600 hover:underline font-medium">
            Review in Communications Manager →
          </a>
        </Card>
      </div>
    </div>
  )
}
