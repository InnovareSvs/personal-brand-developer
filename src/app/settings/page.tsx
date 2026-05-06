import { prisma } from '@/db/client'
import { SettingsTabs } from '@/components/settings/SettingsTabs'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const user = await prisma.userProfile.findFirst({ include: { audiences: true } })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Configure your brand profile, audiences, platforms, and system preferences</p>
      </div>

      {!user ? (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">No Profile Found</h3>
          <p className="text-sm text-slate-500 mb-4">Seed the database to create your initial profile, then return here to edit it.</p>
          <code className="text-xs bg-slate-100 p-3 rounded block font-mono">npm run db:seed</code>
        </div>
      ) : (
        <SettingsTabs
          profile={user as unknown as Record<string, unknown>}
          audiences={user.audiences as unknown as Record<string, unknown>[]}
        />
      )}
    </div>
  )
}
