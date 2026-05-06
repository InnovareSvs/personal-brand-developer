'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GenerateSummaryButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handle() {
    setLoading(true)
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handle}
      disabled={loading}
      className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Generating...' : 'Generate Summary'}
    </button>
  )
}
