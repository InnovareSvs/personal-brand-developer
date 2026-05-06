import { NextResponse } from 'next/server'
import { prisma } from '@/db/client'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const audiences = await prisma.audienceProfile.findMany({ where: userId ? { userId } : undefined })
  return NextResponse.json(audiences)
}

export async function POST(req: Request) {
  const body = await req.json()
  const audience = await prisma.audienceProfile.create({ data: body })
  return NextResponse.json(audience, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...data } = body
  const audience = await prisma.audienceProfile.update({ where: { id }, data })
  return NextResponse.json(audience)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')!
  await prisma.audienceProfile.delete({ where: { id } })
  return NextResponse.json({ deleted: true })
}
