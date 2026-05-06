import { prisma } from '@/db/client'
import { Card } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await prisma.userProfile.findFirst({ include: { audiences: true } })

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Configure your brand profile, audiences, and system preferences</p>
      </div>

      {!user ? (
        <Card title="Create Your Profile">
          <p className="text-sm text-slate-500 mb-4">No profile found. Add one via the API or seed the database.</p>
          <code className="text-xs bg-slate-100 p-3 rounded block">npm run db:seed</code>
        </Card>
      ) : (
        <>
          <Card title="Brand Profile">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Name', user.name],
                ['Industry', user.industry ?? '—'],
                ['Approval Mode', user.approvalPreferences],
                ['Email Report', user.emailReportRecipient ?? '—'],
                ['Website', user.websiteUrl ?? '—'],
                ['Platforms', user.approvedPlatforms.join(', ') || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-slate-400 uppercase tracking-wide">{label}</dt>
                  <dd className="text-slate-800 font-medium mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>
            {user.bio && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Bio</p>
                <p className="text-sm text-slate-700">{user.bio}</p>
              </div>
            )}
            {user.brandVoice && (
              <div className="mt-3">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Brand Voice</p>
                <p className="text-sm text-slate-700">{user.brandVoice}</p>
              </div>
            )}
          </Card>

          {user.audiences.length > 0 && (
            <Card title="Audience Profiles">
              <div className="space-y-4">
                {user.audiences.map((a) => (
                  <div key={a.id} className="border border-slate-100 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-800 mb-2">{a.name}</h4>
                    <dl className="grid grid-cols-2 gap-2 text-xs">
                      <div><dt className="text-slate-400">Industry</dt><dd className="text-slate-700">{a.industry ?? '—'}</dd></div>
                      <div><dt className="text-slate-400">Seniority</dt><dd className="text-slate-700">{a.seniority ?? '—'}</dd></div>
                      <div><dt className="text-slate-400">Job Titles</dt><dd className="text-slate-700">{a.jobTitles.join(', ') || '—'}</dd></div>
                      <div><dt className="text-slate-400">Platforms</dt><dd className="text-slate-700">{a.preferredChannels.join(', ') || '—'}</dd></div>
                    </dl>
                    {a.painPoints.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-slate-400 mb-1">Pain Points</p>
                        <ul className="text-xs text-slate-600 list-disc list-inside">
                          {a.painPoints.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card title="Approval Mode">
            <p className="text-sm text-slate-600 mb-3">Current mode: <strong>{user.approvalPreferences}</strong></p>
            <div className="space-y-2 text-sm text-slate-500">
              <p><strong>Manual</strong> — drafts and recommendations only. You approve everything.</p>
              <p><strong>Assisted</strong> — content can be scheduled, but comments and outreach require approval.</p>
              <p><strong>Autonomous</strong> — system acts within brand rules. Escalated items still require review.</p>
            </div>
            <p className="text-xs text-slate-400 mt-3">Update via <code className="bg-slate-100 px-1 rounded">PATCH /api/profile</code></p>
          </Card>

          <Card title="Restricted Topics">
            {user.restrictedTopics.length === 0 ? (
              <p className="text-sm text-slate-400">None configured.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {user.restrictedTopics.map((t) => (
                  <li key={t} className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full">{t}</li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
