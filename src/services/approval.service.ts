import { prisma } from '@/db/client'

export async function approveContent(contentItemId: string): Promise<void> {
  await prisma.contentItem.update({
    where: { id: contentItemId },
    data: { approvalStatus: 'approved', status: 'scheduled' },
  })
}

export async function rejectContent(contentItemId: string): Promise<void> {
  await prisma.contentItem.update({
    where: { id: contentItemId },
    data: { approvalStatus: 'rejected', status: 'archived' },
  })
}

export async function approveEngagementAction(actionId: string): Promise<void> {
  await prisma.engagementAction.update({
    where: { id: actionId },
    data: { status: 'approved' },
  })
}

export async function rejectEngagementAction(actionId: string): Promise<void> {
  await prisma.engagementAction.update({
    where: { id: actionId },
    data: { status: 'rejected' },
  })
}

export async function getPendingReviewItems(userId: string) {
  const [contentItems, engagementActions, opportunities] = await Promise.all([
    prisma.contentItem.findMany({ where: { userId, approvalStatus: 'pending' }, orderBy: { performanceScore: 'desc' } }),
    prisma.engagementAction.findMany({ where: { userId, requiresReview: true, status: 'pending' } }),
    prisma.opportunity.findMany({ where: { userId, requiresReview: true, status: 'new' } }),
  ])
  return { contentItems, engagementActions, opportunities }
}
