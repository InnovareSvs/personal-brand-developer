import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/db/client'
import { calculateContentOverallScore } from '@/utils/scoring'

const client = new Anthropic()

function loadPrompt(filename: string): string {
  return fs.readFileSync(path.join(process.cwd(), 'src', 'agents', 'content-manager', filename), 'utf-8')
}

export interface ContentManagerInput {
  userId: string
  signalId: string
  topic: string
  signalSummary: string
  brandVoice: string
  platforms: string[]
  audienceDescription: string
}

export interface ContentManagerOutput {
  contentItemsCreated: number
  topItem: { title: string; platform: string; overallScore: number } | null
}

export async function runContentManager(input: ContentManagerInput): Promise<ContentManagerOutput> {
  const systemPrompt = loadPrompt('prompt.md')

  const userMessage = `
Generate content based on this signal:

Topic: ${input.topic}
Signal Summary: ${input.signalSummary}
Brand Voice: ${input.brandVoice}
Target Audience: ${input.audienceDescription}
Platforms to generate for: ${input.platforms.join(', ')}

Create one content item per platform. Score each item. Return valid JSON only.
`.trim()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  let parsed: { contentItems: any[] }
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    parsed = JSON.parse(jsonMatch?.[0] ?? '{"contentItems":[]}')
  } catch {
    parsed = { contentItems: [] }
  }

  const created = await Promise.all(
    parsed.contentItems.map(async (item: any) => {
      const overallScore = calculateContentOverallScore({
        hookScore: item.hookScore ?? 0,
        clarityScore: item.clarityScore ?? 0,
        authorityScore: item.authorityScore ?? 0,
        engagementScore: item.engagementScore ?? 0,
        seoScore: item.seoScore ?? 0,
        ctaScore: item.ctaScore ?? 0,
      })

      return prisma.contentItem.create({
        data: {
          userId: input.userId,
          sourceSignalId: input.signalId,
          title: item.title ?? 'Untitled',
          body: item.body ?? '',
          platform: item.platform ?? 'unknown',
          contentType: item.contentType ?? 'post',
          status: 'draft',
          approvalStatus: 'pending',
          hookScore: item.hookScore ?? 0,
          clarityScore: item.clarityScore ?? 0,
          authorityScore: item.authorityScore ?? 0,
          engagementScore: item.engagementScore ?? 0,
          seoScore: item.seoScore ?? 0,
          ctaScore: item.ctaScore ?? 0,
          performanceScore: overallScore,
        },
      })
    })
  )

  const top = created.sort((a, b) => b.performanceScore - a.performanceScore)[0] ?? null

  return {
    contentItemsCreated: created.length,
    topItem: top ? { title: top.title, platform: top.platform, overallScore: top.performanceScore } : null,
  }
}
