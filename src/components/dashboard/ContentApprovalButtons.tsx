'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ContentApprovalButtons({ contentId }: { contentId: string }) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const router = useRouter()

  async function handle(action: 'approve' | 'reject') {
    setLoading(action)
    await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: contentId, action }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={() => handle('approve')}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {loading === 'approve' ? '...' : 'Approve'}
      </button>
      <button
        onClick={() => handle('reject')}
        disabled={!!loading}
        className="text-xs px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 transition-colors"
      >
        {loading === 'reject' ? '...' : 'Reject'}
      </button>
    </div>
  )
}
