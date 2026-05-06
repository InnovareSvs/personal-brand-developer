import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/db/client'
import { calculateCompositeSignalScore } from '@/utils/scoring'

const client = new Anthropic()

function loadPrompt(filename: string): string {
  return fs.readFileSync(path.join(process.cwd(), 'src', 'agents', 'signal-tracker', filename), 'utf-8')
}

export interface SignalTrackerInput {
  userId: string
  industry: string
  audience: string
  keywords: string[]
  competitors: string[]
  platforms: string[]
}

export interface SignalTrackerOutput {
  signalsCreated: number
  topSignals: Array<{ topic: string; compositeScore: number; summary: string }>
  intelligenceSummary: string
}

export async function runSignalTracker(input: SignalTrackerInput): Promise<SignalTrackerOutput> {
  const systemPrompt = loadPrompt('prompt.md')

  const userMessage = `
Analyze audience signals for the following brand:

Industry: ${input.industry}
Target Audience: ${input.audience}
Keywords to monitor: ${input.keywords.join(', ')}
Competitors/Influencers: ${input.competitors.join(', ')}
Active Platforms: ${input.platforms.join(', ')}

Generate 3–5 high-quality signals based on likely trending topics for this audience right now.
Return valid JSON only.
`.trim()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  let parsed: { signals: any[]; summary: string }
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    parsed = JSON.parse(jsonMatch?.[0] ?? '{"signals":[],"summary":""}')
  } catch {
    parsed = { signals: [], summary: 'Signal parsing failed.' }
  }

  const createdSignals = await Promise.all(
    parsed.signals.map(async (s: any) => {
      const compositeScore = calculateCompositeSignalScore({
        relevanceScore: s.relevanceScore ?? 0,
        engagementScore: s.engagementScore ?? 0,
        authorityScore: s.authorityScore ?? 0,
        revenueScore: s.revenueScore ?? 0,
        trendScore: s.trendScore ?? 0,
        urgencyScore: s.urgencyScore ?? 0,
        confidenceScore: s.confidenceScore ?? 0,
      })

      return prisma.signal.create({
        data: {
          userId: input.userId,
          source: s.source ?? 'AI Analysis',
          platform: s.platform ?? 'unknown',
          topic: s.topic ?? 'Untitled Signal',
          keyword: s.keyword ?? null,
          summary: s.summary ?? '',
          url: s.url ?? null,
          relevanceScore: s.relevanceScore ?? 0,
          engagementScore: s.engagementScore ?? 0,
          authorityScore: s.authorityScore ?? 0,
          revenueScore: s.revenueScore ?? 0,
          trendScore: s.trendScore ?? 0,
          urgencyScore: s.urgencyScore ?? 0,
          confidenceScore: s.confidenceScore ?? 0,
          compositeScore,
          status: 'new',
        },
      })
    })
  )

  return {
    signalsCreated: createdSignals.length,
    topSignals: createdSignals
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 3)
      .map((s) => ({ topic: s.topic, compositeScore: s.compositeScore, summary: s.summary })),
    intelligenceSummary: parsed.summary,
  }
}
