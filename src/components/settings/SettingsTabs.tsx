'use client'

import { useState } from 'react'
import { BrandProfileForm } from './BrandProfileForm'
import { AudienceForm } from './AudienceForm'
import { PlatformConnectionsForm } from './PlatformConnectionsForm'
import { SignalSourcesForm } from './SignalSourcesForm'
import { NotificationsForm } from './NotificationsForm'

const TABS = [
  { id: 'brand', label: 'Brand Profile' },
  { id: 'audiences', label: 'Audiences' },
  { id: 'platforms', label: 'Platform Connections' },
  { id: 'signals', label: 'Signal Sources' },
  { id: 'notifications', label: 'Notifications & Reports' },
]

interface Props {
  profile: Record<string, unknown>
  audiences: Record<string, unknown>[]
}

export function SettingsTabs({ profile, audiences }: Props) {
  const [activeTab, setActiveTab] = useState('brand')

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-slate-200 mb-6 overflow-x-auto">
        <nav className="flex gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'brand' && <BrandProfileForm profile={profile} />}
      {activeTab === 'audiences' && (
        <AudienceForm
          audiences={audiences as unknown as Parameters<typeof AudienceForm>[0]['audiences']}
          userId={profile.id as string}
        />
      )}
      {activeTab === 'platforms' && (
        <PlatformConnectionsForm
          profileId={profile.id as string}
          platformConfig={(profile.platformConfig as Record<string, unknown>) ?? {}}
        />
      )}
      {activeTab === 'signals' && <SignalSourcesForm profile={profile} />}
      {activeTab === 'notifications' && <NotificationsForm profile={profile} />}
    </div>
  )
}
