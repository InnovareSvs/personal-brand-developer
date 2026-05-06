import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.userProfile.upsert({
    where: { id: 'seed-user-1' },
    update: {},
    create: {
      id: 'seed-user-1',
      name: 'Alex Morgan',
      bio: 'B2B SaaS consultant helping mid-market companies scale their go-to-market motion.',
      industry: 'B2B SaaS',
      goals: ['Build thought leadership in B2B sales', 'Generate inbound consulting inquiries'],
      brandVoice: 'Direct, experienced, practical. No fluff. Teach first, sell never.',
      approvedPlatforms: ['linkedin', 'twitter', 'blog'],
      restrictedTopics: ['politics', 'religion', 'competitors by name'],
      websiteUrl: 'https://alexmorgan.com',
      blogUrl: 'https://alexmorgan.com/blog',
      emailReportRecipient: 'alex@alexmorgan.com',
      approvalPreferences: 'assisted',
    },
  })

  await prisma.audienceProfile.upsert({
    where: { id: 'seed-audience-1' },
    update: {},
    create: {
      id: 'seed-audience-1',
      userId: user.id,
      name: 'VP of Sales at B2B SaaS',
      industry: 'B2B SaaS',
      jobTitles: ['VP of Sales', 'CRO', 'Head of Revenue', 'Director of Sales'],
      seniority: 'Senior / Executive',
      painPoints: ['Pipeline predictability', 'Rep ramp time', 'CRM adoption', 'Forecasting accuracy'],
      desiredOutcomes: ['Hit quota', 'Build repeatable process', 'Scale the team'],
      buyingTriggers: ['Missing quota two quarters in a row', 'New CRO hire', 'Series B funding'],
      preferredChannels: ['linkedin', 'newsletter', 'podcasts'],
      commonQuestions: ['How do I build a repeatable sales process?', 'What does good pipeline hygiene look like?'],
      objections: ['We already have a process', 'Not the right time'],
      notes: 'Highly active on LinkedIn. Prefer data-backed insights over generic advice.',
    },
  })

  await prisma.signal.createMany({
    data: [
      {
        userId: user.id,
        source: 'LinkedIn',
        platform: 'linkedin',
        topic: 'Pipeline Coverage Ratios',
        keyword: 'pipeline coverage',
        summary: 'Multiple VPs of Sales discussing ideal pipeline coverage ratios for Q4 planning. High engagement, practical questions.',
        relevanceScore: 0.92,
        engagementScore: 0.88,
        authorityScore: 0.85,
        revenueScore: 0.80,
        trendScore: 0.75,
        urgencyScore: 0.70,
        confidenceScore: 0.90,
        compositeScore: 0.84,
        status: 'new',
      },
      {
        userId: user.id,
        source: 'Twitter/X',
        platform: 'twitter',
        topic: 'AI in Sales Enablement',
        keyword: 'AI sales enablement',
        summary: 'Growing discussion about AI tools replacing traditional sales enablement. Mixed sentiment — opportunity to provide balanced take.',
        relevanceScore: 0.85,
        engagementScore: 0.80,
        authorityScore: 0.78,
        revenueScore: 0.72,
        trendScore: 0.90,
        urgencyScore: 0.65,
        confidenceScore: 0.82,
        compositeScore: 0.80,
        status: 'new',
      },
    ],
    skipDuplicates: true,
  })

  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
