'use client'

import { useState } from 'react'
import { TagInput } from '@/components/ui/TagInput'
import { Toast } from '@/components/ui/Toast'

interface Props {
  profile: Record<string, unknown>
}

export function SignalSourcesForm({ profile }: Props) {
  const platformConfig = (profile.platformConfig as Record<string, unknown>) ?? {}

  const [form, setForm] = useState({
    keywords: (profile.keywords as string[]) ?? [],
    competitors: (profile.competitors as string[]) ?? [],
    influencers: (profile.influencers as string[]) ?? [],
    monitorIndustries: (profile.monitorIndustries as string[]) ?? [],
    monitorSubreddits: (profile.monitorSubreddits as string[]) ?? [],
    monitorHashtags: (profile.monitorHashtags as string[]) ?? [],
    monitoringFrequency: (profile.monitoringFrequency as string) ?? 'every-4-hours',
    rssFeedUrls: (platformConfig.rssFeedUrls as string) ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: null }), 3000)
  }

  async function save() {
    setSaving(true)
    try {
      const { rssFeedUrls, ...profileFields } = form
      const existingConfig = (profile.platformConfig as Record<string, unknown>) ?? {}
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profile.id,
          ...profileFields,
          platformConfig: { ...existingConfig, rssFeedUrls },
        }),
      })
      if (!res.ok) throw new Error()
      showToast('Signal sources saved.', 'success')
    } catch {
      showToast('Failed to save.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
  const labelClass = 'block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1'

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-500">Configure what the Signal Tracker monitors. Keywords, competitors, and influencers set here are also reflected in your Brand Profile.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Keywords to Monitor</label>
          <TagInput value={form.keywords} onChange={(v) => set('keywords', v)} placeholder="Add a keyword…" />
        </div>
        <div>
          <label className={labelClass}>Competitors to Track</label>
          <TagInput value={form.competitors} onChange={(v) => set('competitors', v)} placeholder="Add a competitor…" />
        </div>
        <div>
          <label className={labelClass}>Influencers to Monitor</label>
          <TagInput value={form.influencers} onChange={(v) => set('influencers', v)} placeholder="Add an influencer name…" />
        </div>
        <div>
          <label className={labelClass}>Industries to Monitor</label>
          <TagInput value={form.monitorIndustries} onChange={(v) => set('monitorIndustries', v)} placeholder="e.g. B2B SaaS, RevOps…" />
        </div>
        <div>
          <label className={labelClass}>Subreddits to Watch</label>
          <TagInput value={form.monitorSubreddits} onChange={(v) => set('monitorSubreddits', v)} placeholder="e.g. r/sales, r/startups…" />
        </div>
        <div>
          <label className={labelClass}>Hashtags to Track</label>
          <TagInput value={form.monitorHashtags} onChange={(v) => set('monitorHashtags', v)} placeholder="e.g. #saas, #b2bsales…" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>RSS Feed URLs (one per line)</label>
          <textarea
            className={inputClass}
            rows={4}
            value={form.rssFeedUrls}
            onChange={(e) => set('rssFeedUrls', e.target.value)}
            placeholder="https://example.com/feed&#10;https://industry-blog.com/rss"
          />
        </div>
        <div>
          <label className={labelClass}>Monitoring Frequency</label>
          <select className={inputClass} value={form.monitoringFrequency} onChange={(e) => set('monitoringFrequency', e.target.value)}>
            <option value="every-hour">Every hour</option>
            <option value="every-4-hours">Every 4 hours</option>
            <option value="every-12-hours">Every 12 hours</option>
            <option value="daily">Daily</option>
          </select>
        </div>
      </div>

      <div>
        <button
          onClick={save}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Signal Sources'}
        </button>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
