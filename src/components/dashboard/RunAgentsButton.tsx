'use client'

import { useState } from 'react'

export default function RunAgentsButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleRun() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (data.success) {
        setResult(`Done: ${data.result.signals} signals, ${data.result.contentItems} content items, ${data.result.engagementActions} engagement actions`)
      } else {
        setResult(`Error: ${data.error}`)
      }
    } catch (e) {
      setResult('Failed to run agents.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-right">
      <button
        onClick={handleRun}
        disabled={loading}
        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Running...' : 'Run Agents'}
      </button>
      {result && <p className="text-xs text-slate-500 mt-2 max-w-xs">{result}</p>}
    </div>
  )
}
