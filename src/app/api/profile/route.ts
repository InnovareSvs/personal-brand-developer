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
  try {
    const body = await req.json()
    const { id, ...data } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    // Merge platformConfig rather than replace
    if (data.platformConfig) {
      const existing = await prisma.userProfile.findUnique({ where: { id }, select: { platformConfig: true } })
      const existingConfig = (existing?.platformConfig as Record<string, unknown>) ?? {}
      data.platformConfig = { ...existingConfig, ...data.platformConfig }
    }

    const profile = await prisma.userProfile.update({ where: { id }, data })
    return NextResponse.json(profile)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
