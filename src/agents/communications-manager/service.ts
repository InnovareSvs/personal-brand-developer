import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/db/client'
import { runSignalTracker } from '@/agents/signal-tracker/service'
import { runContentManager } from '@/agents/content-manager/service'
import { shouldEscalate } from '@/utils/scoring'
import type { AgentRunResult } from '@/types'

const client = new Anthropic()

function loadPrompt(filename: string): string {
  return fs.readFileSync(path.join(process.cwd(), 'src', 'agents', 'communications-manager', filename), 'utf-8')
}

export async function runCommunicationsManager(userId: string): Promise<AgentRunResult> {
  const user = await prisma.userProfile.findUnique({
    where: { id: userId },
    include: { audiences: true },
  })

  if (!user) throw new Error(`User ${userId} not found`)

  const audience = user.audiences[0]
  const audienceDescription = audience
    ? `${audience.name} — ${audience.industry}, ${audience.seniority}`
    : user.industry ?? 'professional audience'

  // Step 1: Run Signal Tracker
  const signalResult = await runSignalTracker({
    userId,
    industry: user.industry ?? 'general',
    audience: audienceDescription,
    keywords: [],
    competitors: [],
    platforms: user.approvedPlatforms,
  })

  // Step 2: Get top signals and generate content for each
  const topSignals = await prisma.signal.findMany({
    where: { userId, status: 'new' },
    orderBy: { compositeScore: 'desc' },
    take: 3,
  })

  let contentItemsCreated = 0
  for (const signal of topSignals) {
    const contentResult = await runContentManager({
      userId,
      signalId: signal.id,
      topic: signal.topic,
      signalSummary: signal.summary,
      brandVoice: user.brandVoice ?? 'professional and direct',
      platforms: user.approvedPlatforms.slice(0, 2),
      audienceDescription,
    })
    contentItemsCreated += contentResult.contentItemsCreated

    // Mark signal as acted on
    await prisma.signal.update({ where: { id: signal.id }, data: { status: 'acted' } })
  }

  // Step 3: Generate engagement plan via Communications Manager LLM
  const systemPrompt = loadPrompt('prompt.md')
  const recentContent = await prisma.contentItem.findMany({
    where: { userId, approvalStatus: 'pending' },
    orderBy: { performanceScore: 'desc' },
    take: 5,
  })

  const userMessage = `
You are orchestrating personal brand activity for:
- Industry: ${user.industry}
- Audience: ${audienceDescription}
- Platforms: ${user.approvedPlatforms.join(', ')}
- Approval mode: ${user.approvalPreferences}

Top signals found: ${signalResult.topSignals.map((s) => `"${s.topic}" (score: ${s.compositeScore.toFixed(2)})`).join(', ')}

Content items pending approval: ${recentContent.length}

Generate a deployment plan, 3–5 engagement actions, and identify any opportunities. Return valid JSON only.
`.trim()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  let parsed: { deploymentPlan?: any[]; engagementActions?: any[]; opportunities?: any[]; escalations?: any[] }
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    parsed = JSON.parse(jsonMatch?.[0] ?? '{}')
  } catch {
    parsed = {}
  }

  // Save engagement actions
  const actions = parsed.engagementActions ?? []
  await Promise.all(
    actions.map((a: any) =>
      prisma.engagementAction.create({
        data: {
          userId,
          platform: a.platform ?? 'unknown',
          actionType: a.actionType ?? 'like',
          targetName: a.targetName ?? null,
          targetUrl: a.targetUrl ?? null,
          generatedResponse: a.generatedResponse ?? null,
          requiresReview: a.requiresReview ?? true,
          priorityScore: a.priorityScore ?? 5,
          status: 'pending',
        },
      })
    )
  )

  // Save opportunities
  const opportunities = parsed.opportunities ?? []
  await Promise.all(
    opportunities.map((o: any) =>
      prisma.opportunity.create({
        data: {
          userId,
          opportunityType: o.opportunityType ?? 'general',
          summary: o.summary ?? '',
          priority: o.priority ?? 'medium',
          recommendedAction: o.recommendedAction ?? null,
          requiresReview: o.requiresReview ?? true,
          status: 'new',
        },
      })
    )
  )

  const escalations = parsed.escalations ?? []

  return {
    signals: signalResult.signalsCreated,
    contentItems: contentItemsCreated,
    engagementActions: actions.length,
    opportunities: opportunities.length,
    escalations: escalations.length,
    summary: signalResult.intelligenceSummary,
  }
}
