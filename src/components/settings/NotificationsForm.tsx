'use client'

import { useState } from 'react'
import { Toast } from '@/components/ui/Toast'

interface Props {
  profile: Record<string, unknown>
}

export function NotificationsForm({ profile }: Props) {
  const [form, setForm] = useState({
    emailReportRecipient: (profile.emailReportRecipient as string) ?? '',
    escalationEmail: (profile.escalationEmail as string) ?? '',
    reportFrequency: (profile.reportFrequency as string) ?? 'every-2-days',
    notifyOpportunity: (profile.notifyOpportunity as boolean) ?? true,
    notifyHighRisk: (profile.notifyHighRisk as boolean) ?? true,
    notifyAgentRun: (profile.notifyAgentRun as boolean) ?? false,
    notifyNewSignal: (profile.notifyNewSignal as boolean) ?? true,
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
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: profile.id, ...form }),
      })
      if (!res.ok) throw new Error()
      showToast('Notification settings saved.', 'success')
    } catch {
      showToast('Failed to save.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
  const labelClass = 'block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1'

  const NOTIFY_OPTIONS = [
    { key: 'notifyOpportunity', label: 'New opportunity detected', desc: 'Lead, speaking, or partnership opportunity found.' },
    { key: 'notifyHighRisk', label: 'High-risk content flagged', desc: 'Content or engagement flagged for human review.' },
    { key: 'notifyAgentRun', label: 'Agent run complete', desc: 'Receive a notification each time agents finish a cycle.' },
    { key: 'notifyNewSignal', label: 'New signal above threshold', desc: 'A high-scoring signal was detected in your topics.' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Email Report Recipient</label>
          <input className={inputClass} type="email" value={form.emailReportRecipient} onChange={(e) => set('emailReportRecipient', e.target.value)} placeholder="you@yourcompany.com" />
          <p className="text-xs text-slate-400 mt-1">Receives the regular activity summary email.</p>
        </div>
        <div>
          <label className={labelClass}>Escalation Email</label>
          <input className={inputClass} type="email" value={form.escalationEmail} onChange={(e) => set('escalationEmail', e.target.value)} placeholder="urgent@yourcompany.com" />
          <p className="text-xs text-slate-400 mt-1">Receives alerts for high-priority or high-risk items.</p>
        </div>
        <div>
          <label className={labelClass}>Report Frequency</label>
          <select className={inputClass} value={form.reportFrequency} onChange={(e) => set('reportFrequency', e.target.value)}>
            <option value="daily">Daily</option>
            <option value="every-2-days">Every 2 days</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Notify Me When</label>
        <div className="space-y-3 mt-2">
          {NOTIFY_OPTIONS.map(({ key, label, desc }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) => set(key, e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={save}
          disabled={saving}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Notification Settings'}
        </button>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
