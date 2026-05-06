import { NextResponse } from 'next/server'
import { runCommunicationsManager } from '@/agents/communications-manager/service'

export async function POST(req: Request) {
  const body = await req.json()
  const { userId } = body

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }

  try {
    const result = await runCommunicationsManager(userId)
    return NextResponse.json({ success: true, result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
