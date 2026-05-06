import { prisma } from '@/db/client'
import { Card } from '@/components/ui/Card'
import { getPerformanceSummary } from '@/services/analytics.service'
import GenerateSummaryButton from '@/components/dashboard/GenerateSummaryButton'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const user = await prisma.userProfile.findFirst()

  const [summaries, metrics] = user
    ? await Promise.all([
        prisma.activitySummary.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10 }),
        getPerformanceSummary(user.id),
      ])
    : [[], { totals: { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, followersGained: 0 }, avgEngagementRate: 0, dataPoints: 0 }]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Two-day activity summaries and performance trends</p>
        </div>
        {user && <GenerateSummaryButton userId={user.id} />}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {[
          { label: 'Impressions', value: metrics.totals.impressions.toLocaleString() },
          { label: 'Likes', value: metrics.totals.likes.toLocaleString() },
          { label: 'Comments', value: metrics.totals.comments.toLocaleString() },
          { label: 'Shares', value: metrics.totals.shares.toLocaleString() },
          { label: 'Clicks', value: metrics.totals.clicks.toLocaleString() },
          { label: 'Followers', value: `+${metrics.totals.followersGained}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <section>
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Activity Summaries</h3>
        {summaries.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-400">No summaries generated yet. Click "Generate Summary" to create your first report.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {summaries.map((s) => (
              <Card key={s.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {new Date(s.reportingPeriodStart).toLocaleDateString()} – {new Date(s.reportingPeriodEnd).toLocaleDateString()}
                    </p>
                    <div className="flex gap-3 text-xs text-slate-400 mt-1">
                      <span>{s.contentPublishedCount} published</span>
                      <span>{s.engagementActionsCount} actions</span>
                      <span>{s.opportunitiesIdentifiedCount} opportunities</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{s.emailSent ? 'Email sent' : 'Not sent'}</span>
                </div>
                <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 rounded p-3 max-h-40 overflow-y-auto">
                  {s.summaryBody.slice(0, 600)}…
                </pre>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
