import { prisma } from '@/db/client'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPlatformLabel } from '@/utils/formatting'

export const dynamic = 'force-dynamic'

export default async function SignalsPage() {
  const user = await prisma.userProfile.findFirst()
  const signals = user
    ? await prisma.signal.findMany({ where: { userId: user.id }, orderBy: { compositeScore: 'desc' } })
    : []

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Signal Tracker</h2>
        <p className="text-slate-500 text-sm mt-1">Audience intelligence ranked by opportunity score</p>
      </div>

      {signals.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">No signals collected yet. Run the agents from the dashboard to begin intelligence gathering.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {signals.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-800">{s.topic}</h3>
                    <Badge label={formatPlatformLabel(s.platform)} variant="info" />
                    <Badge label={s.status} variant={s.status === 'new' ? 'warning' : 'default'} />
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{s.summary}</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Relevance', value: s.relevanceScore },
                      { label: 'Engagement', value: s.engagementScore },
                      { label: 'Authority', value: s.authorityScore },
                      { label: 'Revenue', value: s.revenueScore },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-slate-400">{label}</p>
                        <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${value * 100}%` }} />
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{(value * 100).toFixed(0)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400">Composite</p>
                  <p className="text-2xl font-bold text-brand-600">{(s.compositeScore * 100).toFixed(0)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
