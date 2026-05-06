import { prisma } from '@/db/client'
import { get48HoursAgo, formatReportingPeriod } from '@/utils/dates'

export interface SummaryEmailData {
  userId: string
  recipientEmail: string
  startDate: Date
  endDate: Date
}

export async function generateSummaryEmail(data: SummaryEmailData): Promise<string> {
  const { userId, startDate, endDate } = data

  const [publishedContent, scheduledContent, engagementActions, signals, opportunities, relationships] = await Promise.all([
    prisma.contentItem.findMany({ where: { userId, status: 'published', publishedTime: { gte: startDate } } }),
    prisma.contentItem.findMany({ where: { userId, status: 'scheduled', scheduledTime: { gte: startDate } } }),
    prisma.engagementAction.findMany({ where: { userId, createdAt: { gte: startDate } } }),
    prisma.signal.findMany({ where: { userId, createdAt: { gte: startDate } }, orderBy: { compositeScore: 'desc' }, take: 5 }),
    prisma.opportunity.findMany({ where: { userId, createdAt: { gte: startDate } } }),
    prisma.relationship.findMany({ where: { userId, createdAt: { gte: startDate } }, take: 3 }),
  ])

  const repliedComments = engagementActions.filter((a) => a.actionType === 'reply' && a.status === 'completed').length
  const likes = engagementActions.filter((a) => a.actionType === 'like' && a.status === 'completed').length
  const conversations = engagementActions.filter((a) => a.actionType === 'comment' && a.status === 'completed').length
  const shares = engagementActions.filter((a) => a.actionType === 'share' && a.status === 'completed').length

  const itemsRequiringReview = [
    ...engagementActions.filter((a) => a.requiresReview && a.status === 'pending').map((a) => `Engagement action: ${a.actionType} on ${a.platform}`),
    ...opportunities.filter((o) => o.requiresReview).map((o) => `Opportunity: ${o.opportunityType} — ${o.summary.slice(0, 60)}`),
  ]

  const body = `Subject: Personal Brand Activity Summary - Last 48 Hours

Personal Brand Activity Summary
Reporting Period: ${formatReportingPeriod(startDate, endDate)}

1. Content Published (${publishedContent.length})
${publishedContent.length > 0 ? publishedContent.map((c) => `- [${c.platform}]: ${c.title}`).join('\n') : '- None'}

2. Content Scheduled (${scheduledContent.length})
${scheduledContent.length > 0 ? scheduledContent.map((c) => `- [${c.platform}]: ${c.title}`).join('\n') : '- None'}

3. Engagement Actions
- Comments replied to: ${repliedComments}
- Relevant posts liked: ${likes}
- Similar conversations joined: ${conversations}
- Shares/reposts completed: ${shares}

4. Strongest Audience Signals
${signals.length > 0 ? signals.map((s) => `- ${s.topic} (score: ${(s.compositeScore * 100).toFixed(0)}%)`).join('\n') : '- None detected'}

5. Best Performing Content
${publishedContent.length > 0
    ? publishedContent.sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 1).map((c) => `- ${c.title}\n  Platform: ${c.platform}\n  Performance score: ${(c.performanceScore * 100).toFixed(0)}%`).join('\n')
    : '- No published content this period'}

6. Relationship Opportunities
${relationships.length > 0 ? relationships.map((r) => `- ${r.name} (${r.role ?? r.platform}): ${r.recommendedNextAction ?? 'Engage'}`).join('\n') : '- None identified'}

7. Inbound Opportunities
${opportunities.length > 0 ? opportunities.map((o) => `- ${o.opportunityType}: ${o.summary.slice(0, 80)}\n  Priority: ${o.priority} | Action: ${o.recommendedAction ?? 'Review'}`).join('\n') : '- None detected'}

8. Recommended Next Topics
- Based on top signals, see Signal Tracker dashboard for details

9. Items Requiring Review (${itemsRequiringReview.length})
${itemsRequiringReview.length > 0 ? itemsRequiringReview.map((i) => `- ${i}`).join('\n') : '- None'}

10. Next 48-Hour Focus
- Continue monitoring top signals and generating content
- Review and approve pending content items
- Complete pending engagement actions
`

  // Save activity summary record
  await prisma.activitySummary.create({
    data: {
      userId,
      reportingPeriodStart: startDate,
      reportingPeriodEnd: endDate,
      contentPublishedCount: publishedContent.length,
      contentScheduledCount: scheduledContent.length,
      engagementActionsCount: engagementActions.length,
      commentsRepliedCount: repliedComments,
      relationshipsIdentifiedCount: relationships.length,
      opportunitiesIdentifiedCount: opportunities.length,
      summaryBody: body,
      emailSent: false,
    },
  })

  // In production: use Resend or SendGrid to send the email
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({ from: process.env.EMAIL_FROM, to: data.recipientEmail, subject: '...', text: body })

  console.log('[EmailService] Summary email generated (simulated send):\n', body.slice(0, 200) + '...')

  return body
}
