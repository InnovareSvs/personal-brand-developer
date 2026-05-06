import { NextResponse } from 'next/server'
import { prisma } from '@/db/client'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { id: _id, userId: _userId, createdAt: _c, updatedAt: _u, user: _user, ...data } = body
    const audience = await prisma.audienceProfile.update({ where: { id: params.id }, data })
    return NextResponse.json(audience)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.audienceProfile.delete({ where: { id: params.id } })
    return NextResponse.json({ deleted: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
