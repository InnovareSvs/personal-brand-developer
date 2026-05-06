import { NextResponse } from 'next/server'
import { prisma } from '@/db/client'
import { approveContent, rejectContent } from '@/services/approval.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')
  const approvalStatus = searchParams.get('approvalStatus')

  const items = await prisma.contentItem.findMany({
    where: {
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {}),
      ...(approvalStatus ? { approvalStatus } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { sourceSignal: true },
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const body = await req.json()
  const item = await prisma.contentItem.create({ data: body })
  return NextResponse.json(item, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, action, ...data } = body

  if (action === 'approve') {
    await approveContent(id)
    return NextResponse.json({ approved: true })
  }
  if (action === 'reject') {
    await rejectContent(id)
    return NextResponse.json({ rejected: true })
  }

  const item = await prisma.contentItem.update({ where: { id }, data })
  return NextResponse.json(item)
}
