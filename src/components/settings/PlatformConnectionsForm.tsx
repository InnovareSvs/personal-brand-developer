'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'

interface PlatformConfig {
  linkedin?: { clientId?: string; clientSecret?: string; accessToken?: string }
  twitter?: { apiKey?: string; apiSecret?: string; accessToken?: string; accessSecret?: string }
  rssFeedUrls?: string
  resend?: { apiKey?: string; fromAddress?: string }
}

interface Props {
  profileId: string
  platformConfig: PlatformConfig
}

export function PlatformConnectionsForm({ profileId, platformConfig: initial }: Props) {
  const [config, setConfig] = useState<PlatformConfig>(initial ?? {})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })

  function setNested(platform: keyof PlatformConfig, key: string, value: string) {
    setConfig((prev) => ({
      ...prev,
      [platform]: { ...(prev[platform] as Record<string, string> ?? {}), [key]: value },
    }))
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: null }), 3000)
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profileId, platformConfig: config }),
      })
      if (!res.ok) throw new Error()
      showToast('Platform connections saved.', 'success')
    } catch {
      showToast('Failed to save.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono'
  const labelClass = 'block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1'

  function isConnected(platform: keyof PlatformConfig): boolean {
    const p = config[platform]
    if (!p || typeof p === 'string') return typeof p === 'string' && p.trim().length > 0
    return Object.values(p).some((v) => v && String(v).trim().length > 0)
  }

  function StatusBadge({ connected }: { connected: boolean }) {
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${connected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
        {connected ? 'Connected' : 'Not Connected'}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
        Credentials are stored in your database. For production deployments, move API keys to environment variables. After saving new credentials, run <code className="font-mono bg-amber-100 px-1 rounded">npm run db:push</code> if prompted.
      </div>

      {/* LinkedIn */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-800">LinkedIn</h4>
          <StatusBadge connected={isConnected('linkedin')} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Client ID</label>
            <input className={inputClass} type="password" value={config.linkedin?.clientId ?? ''} onChange={(e) => setNested('linkedin', 'clientId', e.target.value)} placeholder="LinkedIn Client ID" />
          </div>
          <div>
            <label className={labelClass}>Client Secret</label>
            <input className={inputClass} type="password" value={config.linkedin?.clientSecret ?? ''} onChange={(e) => setNested('linkedin', 'clientSecret', e.target.value)} placeholder="LinkedIn Client Secret" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Access Token</label>
            <input className={inputClass} type="password" value={config.linkedin?.accessToken ?? ''} onChange={(e) => setNested('linkedin', 'accessToken', e.target.value)} placeholder="LinkedIn Access Token" />
          </div>
        </div>
      </div>

      {/* Twitter/X */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-800">Twitter / X</h4>
          <StatusBadge connected={isConnected('twitter')} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>API Key</label>
            <input className={inputClass} type="password" value={config.twitter?.apiKey ?? ''} onChange={(e) => setNested('twitter', 'apiKey', e.target.value)} placeholder="Twitter API Key" />
          </div>
          <div>
            <label className={labelClass}>API Secret</label>
            <input className={inputClass} type="password" value={config.twitter?.apiSecret ?? ''} onChange={(e) => setNested('twitter', 'apiSecret', e.target.value)} placeholder="Twitter API Secret" />
          </div>
          <div>
            <label className={labelClass}>Access Token</label>
            <input className={inputClass} type="password" value={config.twitter?.accessToken ?? ''} onChange={(e) => setNested('twitter', 'accessToken', e.target.value)} placeholder="Twitter Access Token" />
          </div>
          <div>
            <label className={labelClass}>Access Secret</label>
            <input className={inputClass} type="password" value={config.twitter?.accessSecret ?? ''} onChange={(e) => setNested('twitter', 'accessSecret', e.target.value)} placeholder="Twitter Access Secret" />
          </div>
        </div>
      </div>

      {/* RSS Feeds */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-800">RSS Feeds</h4>
          <StatusBadge connected={isConnected('rssFeedUrls')} />
        </div>
        <div>
          <label className={labelClass}>Feed URLs (one per line)</label>
          <textarea
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            rows={4}
            value={config.rssFeedUrls ?? ''}
            onChange={(e) => setConfig((prev) => ({ ...prev, rssFeedUrls: e.target.value }))}
            placeholder="https://example.com/feed&#10;https://blog.industry.com/rss"
          />
        </div>
      </div>

      {/* Email / Resend */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-800">Email (Resend)</h4>
          <StatusBadge connected={isConnected('resend')} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Resend API Key</label>
            <input className={inputClass} type="password" value={config.resend?.apiKey ?? ''} onChange={(e) => setNested('resend', 'apiKey', e.target.value)} placeholder="re_..." />
          </div>
          <div>
            <label className={labelClass}>From Address</label>
            <input className={inputClass} type="email" value={config.resend?.fromAddress ?? ''} onChange={(e) => setNested('resend', 'fromAddress', e.target.value)} placeholder="noreply@yourdomain.com" />
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={save}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Platform Connections'}
        </button>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
