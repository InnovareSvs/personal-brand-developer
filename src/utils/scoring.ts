import type { SignalScore, ContentScore } from '@/types'

export function calculateCompositeSignalScore(scores: Omit<SignalScore, 'compositeScore'>): number {
  const weights = {
    relevanceScore: 0.25,
    engagementScore: 0.20,
    authorityScore: 0.15,
    revenueScore: 0.15,
    trendScore: 0.10,
    urgencyScore: 0.10,
    confidenceScore: 0.05,
  }

  return Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (scores[key as keyof typeof scores] ?? 0) * weight
  }, 0)
}

export function calculateContentOverallScore(scores: Omit<ContentScore, 'overallScore'>): number {
  const weights = {
    hookScore: 0.20,
    clarityScore: 0.20,
    authorityScore: 0.20,
    engagementScore: 0.15,
    seoScore: 0.10,
    ctaScore: 0.15,
  }

  return Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (scores[key as keyof typeof scores] ?? 0) * weight
  }, 0)
}

export function classifyRisk(scores: {
  confidenceScore?: number
  reputationRisk?: boolean
  legalConcern?: boolean
  viralProbability?: number
}): 'low' | 'medium' | 'high' {
  if (scores.legalConcern || scores.reputationRisk) return 'high'
  if ((scores.viralProbability ?? 0) > 0.7) return 'high'
  if ((scores.confidenceScore ?? 1) < 0.6) return 'medium'
  return 'low'
}

export function shouldEscalate(params: {
  confidenceScore: number
  riskLevel: 'low' | 'medium' | 'high'
  relationshipValue?: number
  visibilityScore?: number
}): boolean {
  if (params.confidenceScore < 0.6) return true
  if (params.riskLevel === 'high') return true
  if ((params.relationshipValue ?? 0) > 8) return true
  if ((params.visibilityScore ?? 0) > 0.85) return true
  return false
}
