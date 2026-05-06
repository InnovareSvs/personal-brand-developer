'use client'

import { useState } from 'react'
import { TagInput } from '@/components/ui/TagInput'
import { Toast } from '@/components/ui/Toast'

const SENIORITY_OPTIONS = ['C-Suite', 'VP', 'Director', 'Manager', 'Individual Contributor', 'Founder', 'Other']
const CHANNEL_OPTIONS = ['LinkedIn', 'Twitter/X', 'Email', 'Blog', 'YouTube', 'Podcast', 'Reddit']

interface Audience {
  id: string
  name: string
  industry?: string | null
  jobTitles: string[]
  seniority?: string | null
  painPoints: string[]
  desiredOutcomes: string[]
  buyingTriggers: string[]
  preferredChannels: string[]
  commonQuestions: string[]
  objections: string[]
  notes?: string | null
}

const emptyForm = (): Omit<Audience, 'id'> => ({
  name: '',
  industry: '',
  jobTitles: [],
  seniority: '',
  painPoints: [],
  desiredOutcomes: [],
  buyingTriggers: [],
  preferredChannels: [],
  commonQuestions: [],
  objections: [],
  notes: '',
})

interface Props {
  audiences: Audience[]
  userId: string
}

export function AudienceForm({ audiences: initial, userId }: Props) {
  const [audiences, setAudiences] = useState<Audience[]>(initial)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleChannel(c: string) {
    const channels = form.preferredChannels.includes(c)
      ? form.preferredChannels.filter((x) => x !== c)
      : [...form.preferredChannels, c]
    set('preferredChannels', channels)
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: null }), 3000)
  }

  function openNew() {
    setEditingId(null)
    setForm(emptyForm())
    setShowForm(true)
  }

  function openEdit(a: Audience) {
    setEditingId(a.id)
    setForm({ ...a })
    setShowForm(true)
  }

  function cancel() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm())
  }

  async function save() {
    if (!form.name.trim()) { showToast('Audience name is required.', 'error'); return }
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch(`/api/audiences/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error()
        const updated: Audience = await res.json()
        setAudiences((prev) => prev.map((a) => (a.id === editingId ? updated : a)))
        showToast('Audience updated.', 'success')
      } else {
        const res = await fetch('/api/audiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, userId }),
        })
        if (!res.ok) throw new Error()
        const created: Audience = await res.json()
        setAudiences((prev) => [...prev, created])
        showToast('Audience created.', 'success')
      }
      cancel()
    } catch {
      showToast('Failed to save. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function deleteAudience(id: string) {
    if (!confirm('Delete this audience profile?')) return
    try {
      const res = await fetch(`/api/audiences/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setAudiences((prev) => prev.filter((a) => a.id !== id))
      showToast('Audience deleted.', 'success')
    } catch {
      showToast('Failed to delete.', 'error')
    }
  }

  const inputClass = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
  const labelClass = 'block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1'

  return (
    <div className="space-y-4">
      {audiences.length === 0 && !showForm && (
        <p className="text-sm text-slate-400">No audience profiles yet. Add one to help the agents understand who to target.</p>
      )}

      {audiences.map((a) => (
        <div key={a.id} className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{a.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{[a.industry, a.seniority].filter(Boolean).join(' · ') || 'No details'}</p>
              {a.jobTitles.length > 0 && <p className="text-xs text-slate-400 mt-1">{a.jobTitles.join(', ')}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(a)} className="text-xs text-blue-600 hover:underline font-medium">Edit</button>
              <button onClick={() => deleteAudience(a.id)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
            </div>
          </div>
        </div>
      ))}

      {!showForm && (
        <button
          onClick={openNew}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-dashed border-blue-300 rounded-xl px-4 py-3 w-full hover:bg-blue-50 transition-colors"
        >
          + Add Audience Profile
        </button>
      )}

      {showForm && (
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-5">
          <h4 className="text-sm font-semibold text-slate-800">{editingId ? 'Edit Audience' : 'New Audience Profile'}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Audience Name *</label>
              <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. VP of Sales, Startup Founders" />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <input className={inputClass} value={form.industry ?? ''} onChange={(e) => set('industry', e.target.value)} placeholder="e.g. B2B SaaS, Healthcare" />
            </div>
            <div>
              <label className={labelClass}>Seniority Level</label>
              <select className={inputClass} value={form.seniority ?? ''} onChange={(e) => set('seniority', e.target.value)}>
                <option value="">Select seniority…</option>
                {SENIORITY_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Job Titles</label>
              <TagInput value={form.jobTitles} onChange={(v) => set('jobTitles', v)} placeholder="Add a title and press Enter…" />
            </div>
            <div>
              <label className={labelClass}>Pain Points</label>
              <TagInput value={form.painPoints} onChange={(v) => set('painPoints', v)} placeholder="What frustrates them?" />
            </div>
            <div>
              <label className={labelClass}>Desired Outcomes</label>
              <TagInput value={form.desiredOutcomes} onChange={(v) => set('desiredOutcomes', v)} placeholder="What do they want?" />
            </div>
            <div>
              <label className={labelClass}>Buying Triggers</label>
              <TagInput value={form.buyingTriggers} onChange={(v) => set('buyingTriggers', v)} placeholder="What drives their decisions?" />
            </div>
            <div>
              <label className={labelClass}>Objections</label>
              <TagInput value={form.objections} onChange={(v) => set('objections', v)} placeholder="Common pushback they give…" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Common Questions</label>
              <textarea className={inputClass} rows={3} value={form.commonQuestions.join('\n')} onChange={(e) => set('commonQuestions', e.target.value.split('\n').filter(Boolean))} placeholder="One question per line…" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea className={inputClass} rows={2} value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} placeholder="Anything else worth knowing…" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Preferred Channels</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {CHANNEL_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleChannel(c)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    form.preferredChannels.includes(c)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={save}
              disabled={saving}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : editingId ? 'Update Audience' : 'Create Audience'}
            </button>
            <button onClick={cancel} className="text-sm text-slate-500 hover:text-slate-700 px-4 py-2.5">Cancel</button>
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} />
    </div>
  )
}
