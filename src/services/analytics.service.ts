import { prisma } from '@/db/client'

export async function getPerformanceSummary(userId: string) {
  const metrics = await prisma.performanceMetric.findMany({
    where: { userId },
    orderBy: { measuredAt: 'desc' },
    take: 100,
  })

  const totals = metrics.reduce(
    (acc, m) => ({
      impressions: acc.impressions + m.impressions,
      likes: acc.likes + m.likes,
      comments: acc.comments + m.comments,
      shares: acc.shares + m.shares,
      clicks: acc.clicks + m.clicks,
      followersGained: acc.followersGained + m.followersGained,
    }),
    { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, followersGained: 0 }
  )

  const avgEngagementRate =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length
      : 0

  return { totals, avgEngagementRate, dataPoints: metrics.length }
}

export async function recordMockMetrics(userId: string, contentItemId: string, platform: string) {
  return prisma.performanceMetric.create({
    data: {
      userId,
      contentItemId,
      platform,
      impressions: Math.floor(Math.random() * 2000) + 100,
      likes: Math.floor(Math.random() * 80),
      comments: Math.floor(Math.random() * 20),
      shares: Math.floor(Math.random() * 15),
      clicks: Math.floor(Math.random() * 50),
      saves: Math.floor(Math.random() * 10),
      followersGained: Math.floor(Math.random() * 5),
      engagementRate: parseFloat((Math.random() * 0.08 + 0.01).toFixed(4)),
    },
  })
}

export async function getBrandScore(userId: string): Promise<number> {
  const [signalCount, contentCount, opportunityCount, metricSummary] = await Promise.all([
    prisma.signal.count({ where: { userId } }),
    prisma.contentItem.count({ where: { userId, status: 'published' } }),
    prisma.opportunity.count({ where: { userId } }),
    getPerformanceSummary(userId),
  ])

  const base = Math.min(100, signalCount * 2 + contentCount * 5 + opportunityCount * 3 + metricSummary.totals.followersGained * 2 + Math.round(metricSummary.avgEngagementRate * 500))
  return base
}
