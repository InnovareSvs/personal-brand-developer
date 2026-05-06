import { NextResponse } from 'next/server'
import { prisma } from '@/db/client'
import { approveEngagementAction, rejectEngagementAction } from '@/services/approval.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  const actions = await prisma.engagementAction.findMany({
    where: {
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { priorityScore: 'desc' },
  })
  return NextResponse.json(actions)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, action } = body

  if (action === 'approve') {
    await approveEngagementAction(id)
    return NextResponse.json({ approved: true })
  }
  if (action === 'reject') {
    await rejectEngagementAction(id)
    return NextResponse.json({ rejected: true })
  }

  const updated = await prisma.engagementAction.update({ where: { id }, data: body })
  return NextResponse.json(updated)
}
