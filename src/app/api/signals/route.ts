import { NextResponse } from 'next/server'
import { prisma } from '@/db/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  const signals = await prisma.signal.findMany({
    where: {
      ...(userId ? { userId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { compositeScore: 'desc' },
  })
  return NextResponse.json(signals)
}

export async function POST(req: Request) {
  const body = await req.json()
  const signal = await prisma.signal.create({ data: body })
  return NextResponse.json(signal, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...data } = body
  const signal = await prisma.signal.update({ where: { id }, data })
  return NextResponse.json(signal)
}
