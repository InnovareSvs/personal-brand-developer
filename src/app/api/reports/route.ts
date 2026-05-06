import { NextResponse } from 'next/server'
import { prisma } from '@/db/client'
import { generateSummaryEmail } from '@/services/email.service'
import { get48HoursAgo } from '@/utils/dates'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  const summaries = await prisma.activitySummary.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(summaries)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { userId } = body

  const user = await prisma.userProfile.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const endDate = new Date()
  const startDate = get48HoursAgo()

  const emailBody = await generateSummaryEmail({
    userId,
    recipientEmail: user.emailReportRecipient ?? 'no-reply@example.com',
    startDate,
    endDate,
  })

  return NextResponse.json({ generated: true, preview: emailBody.slice(0, 500) })
}
