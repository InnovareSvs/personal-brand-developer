import { NextResponse } from 'next/server'
import { prisma } from '@/db/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const priority = searchParams.get('priority')

  const opportunities = await prisma.opportunity.findMany({
    where: {
      ...(userId ? { userId } : {}),
      ...(priority ? { priority } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(opportunities)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...data } = body
  const updated = await prisma.opportunity.update({ where: { id }, data })
  return NextResponse.json(updated)
}
