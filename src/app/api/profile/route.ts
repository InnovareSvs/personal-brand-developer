import { NextResponse } from 'next/server'
import { prisma } from '@/db/client'

export async function GET() {
  const profiles = await prisma.userProfile.findMany({ include: { audiences: true } })
  return NextResponse.json(profiles)
}

export async function POST(req: Request) {
  const body = await req.json()
  const profile = await prisma.userProfile.create({ data: body })
  return NextResponse.json(profile, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...data } = body
  const profile = await prisma.userProfile.update({ where: { id }, data })
  return NextResponse.json(profile)
}
