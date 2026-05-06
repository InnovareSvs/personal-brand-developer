import {
  calculateCompositeSignalScore,
  calculateContentOverallScore,
  classifyRisk,
  shouldEscalate,
} from '../src/utils/scoring'

describe('calculateCompositeSignalScore', () => {
  it('returns 0 when all scores are 0', () => {
    const result = calculateCompositeSignalScore({
      relevanceScore: 0,
      engagementScore: 0,
      authorityScore: 0,
      revenueScore: 0,
      trendScore: 0,
      urgencyScore: 0,
      confidenceScore: 0,
    })
    expect(result).toBe(0)
  })

  it('returns 1 when all scores are 1', () => {
    const result = calculateCompositeSignalScore({
      relevanceScore: 1,
      engagementScore: 1,
      authorityScore: 1,
      revenueScore: 1,
      trendScore: 1,
      urgencyScore: 1,
      confidenceScore: 1,
    })
    expect(result).toBeCloseTo(1, 5)
  })

  it('weights relevance score highest', () => {
    const relevanceOnly = calculateCompositeSignalScore({
      relevanceScore: 1,
      engagementScore: 0,
      authorityScore: 0,
      revenueScore: 0,
      trendScore: 0,
      urgencyScore: 0,
      confidenceScore: 0,
    })
    const engagementOnly = calculateCompositeSignalScore({
      relevanceScore: 0,
      engagementScore: 1,
      authorityScore: 0,
      revenueScore: 0,
      trendScore: 0,
      urgencyScore: 0,
      confidenceScore: 0,
    })
    expect(relevanceOnly).toBeGreaterThan(engagementOnly)
  })
})

describe('calculateContentOverallScore', () => {
  it('returns 0 for all-zero scores', () => {
    const result = calculateContentOverallScore({
      hookScore: 0,
      clarityScore: 0,
      authorityScore: 0,
      engagementScore: 0,
      seoScore: 0,
      ctaScore: 0,
    })
    expect(result).toBe(0)
  })

  it('returns weighted average correctly', () => {
    const result = calculateContentOverallScore({
      hookScore: 10,
      clarityScore: 10,
      authorityScore: 10,
      engagementScore: 10,
      seoScore: 10,
      ctaScore: 10,
    })
    expect(result).toBeCloseTo(10, 5)
  })
})

describe('classifyRisk', () => {
  it('returns high when legalConcern is true', () => {
    expect(classifyRisk({ legalConcern: true })).toBe('high')
  })

  it('returns high when reputationRisk is true', () => {
    expect(classifyRisk({ reputationRisk: true })).toBe('high')
  })

  it('returns medium for low confidence score', () => {
    expect(classifyRisk({ confidenceScore: 0.5 })).toBe('medium')
  })

  it('returns low for confident, safe interactions', () => {
    expect(classifyRisk({ confidenceScore: 0.9 })).toBe('low')
  })
})

describe('shouldEscalate', () => {
  it('escalates when confidence is below 0.6', () => {
    expect(shouldEscalate({ confidenceScore: 0.55, riskLevel: 'low' })).toBe(true)
  })

  it('escalates when risk is high', () => {
    expect(shouldEscalate({ confidenceScore: 0.95, riskLevel: 'high' })).toBe(true)
  })

  it('does not escalate for safe, confident interactions', () => {
    expect(shouldEscalate({ confidenceScore: 0.85, riskLevel: 'low' })).toBe(false)
  })

  it('escalates when relationship value is very high', () => {
    expect(shouldEscalate({ confidenceScore: 0.90, riskLevel: 'low', relationshipValue: 9 })).toBe(true)
  })
})
