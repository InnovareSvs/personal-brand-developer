'use client'

import { useState } from 'react'
import { TagInput } from '@/components/ui/TagInput'
import { Toast } from '@/components/ui/Toast'

const PLATFORMS = ['LinkedIn', 'Twitter/X', 'Blog', 'Newsletter', 'Reddit', 'Facebook', 'YouTube', 'Instagram', 'TikTok']
const APPROVAL_MODES = [
  { value: 'manual', label: 'Manual', desc: 'Drafts and recommendations only. You approve every action.' },
  { value: 'assisted', label: 'Assisted', desc: 'Content can be scheduled. Comments and outreach require your approval.' },
  { value: 'autonomous', label: 'Autonomous', desc: 'System acts within brand rules. Escalated items still require review.' },
]

interface Props {
  profile: Record<string, unknown>
}

export function BrandProfileForm({ profile }: Props) {
  const [form, setForm] = useState({
    name: (profile.name as string) ?? '',
    bio: (profile.bio as string) ?? '',
    industry: (profile.industry as string) ?? '',
    brandVoice: (profile.brandVoice as string) ?? '',
    websiteUrl: (profile.websiteUrl as string) ?? '',
    blogUrl: (profile.blogUrl as string) ?? '',
    emailReportRecipient: (profile.emailReportRecipient as string) ?? '',
    approvalPreferences: (profile.approvalPreferences as string) ?? 'assisted',
    approvedPlatforms: (profile.approvedPlatforms as string[]) ?? [],
    restrictedTopics: (profile.restrictedTopics as string[]) ?? [],
    keywords: (profile.keywords as string[]) ?? [],
    competitors: (profile.competitors as string[]) ?? [],
    influencers: (profile.influencers as string[]) ?? [],
    offers: (profile.offers as string[]) ?? [],
    primaryGoals: (profile.primaryGoals as string[]) ?? [],
    secondaryGoals: (profile.secondaryGoals as string[]) ?? [],
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function togglePlatform(p: string) {
    const platforms = form.approvedPlatforms.includes(p)
      ? form.approvedPlatforms.filter((x) => x !== p)
      : [...form.approvedPlatforms, p]
    set('approvedPlatforms', platforms)
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
        body: JSON.stringify({ id: profile.id, ...form }),
      })
      if (!res.ok) throw new Error('Save failed')
      showToast('Brand profile saved.', 'success')
    } catch {
      showToast('Failed to save. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
  const labelClass = 'block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1'

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name</label>
          <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className={labelClass}>Industry</label>
          <input className={inputClass} value={form.industry} onChange={(e) => set('industry', e.target.value)} placeholder="e.g. B2B SaaS, Finance, Marketing" />
        </div>
        <div>
          <label className={labelClass}>Website URL</label>
          <input className={inputClass} type="url" value={form.websiteUrl} onChange={(e) => set('websiteUrl', e.target.value)} placeholder="https://yoursite.com" />
        </div>
        <div>
          <label className={labelClass}>Blog URL</label>
          <input className={inputClass} type="url" value={form.blogUrl} onChange={(e) => set('blogUrl', e.target.value)} placeholder="https://yourblog.com" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Email Report Recipient</label>
          <input className={inputClass} type="email" value={form.emailReportRecipient} onChange={(e) => set('emailReportRecipient', e.target.value)} placeholder="you@yourcompany.com" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Bio</label>
          <textarea className={inputClass} rows={3} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Who you are, what you do, who you help…" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Brand Voice</label>
          <textarea className={inputClass} rows={3} value={form.brandVoice} onChange={(e) => set('brandVoice', e.target.value)} placeholder="Describe your tone, style, and personality. e.g. Direct, practical, no jargon. Speaks to operators not theorists." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Offers / Services / Products</label>
          <TagInput value={form.offers} onChange={(v) => set('offers', v)} placeholder="Add an offer and press Enter…" />
        </div>
        <div>
          <label className={labelClass}>Keywords to Track</label>
          <TagInput value={form.keywords} onChange={(v) => set('keywords', v)} placeholder="Add a keyword…" />
        </div>
        <div>
          <label className={labelClass}>Competitors</label>
          <TagInput value={form.competitors} onChange={(v) => set('competitors', v)} placeholder="Add a competitor name…" />
        </div>
        <div>
          <label className={labelClass}>Influencers to Monitor</label>
          <TagInput value={form.influencers} onChange={(v) => set('influencers', v)} placeholder="Add an influencer name…" />
        </div>
        <div>
          <label className={labelClass}>Primary Goals</label>
          <TagInput value={form.primaryGoals} onChange={(v) => set('primaryGoals', v)} placeholder="e.g. Generate leads, Build authority…" />
        </div>
        <div>
          <label className={labelClass}>Secondary Goals</label>
          <TagInput value={form.secondaryGoals} onChange={(v) => set('secondaryGoals', v)} placeholder="e.g. Podcast appearances, Speaking…" />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Restricted Topics</label>
          <TagInput value={form.restrictedTopics} onChange={(v) => set('restrictedTopics', v)} placeholder="Topics to avoid…" tagColor="red" />
          <p className="text-xs text-slate-400 mt-1">The system will never publish content on these topics.</p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Approved Platforms</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                form.approvedPlatforms.includes(p)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Approval Mode</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
          {APPROVAL_MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              onClick={() => set('approvalPreferences', mode.value)}
              className={`text-left p-4 rounded-xl border transition-colors ${
                form.approvalPreferences === mode.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <p className={`text-sm font-semibold ${form.approvalPreferences === mode.value ? 'text-blue-700' : 'text-slate-800'}`}>{mode.label}</p>
              <p className="text-xs text-slate-500 mt-1">{mode.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Brand Profile'}
        </button>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
