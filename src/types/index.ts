export type ApprovalStatus = 'pending' | 'approved' | 'rejected'
export type ApprovalPreference = 'manual' | 'assisted' | 'autonomous'
export type RiskLevel = 'low' | 'medium' | 'high'
export type Priority = 'low' | 'medium' | 'high'
export type SignalStatus = 'new' | 'reviewed' | 'acted' | 'dismissed'
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived'
export type EngagementActionStatus = 'pending' | 'approved' | 'completed' | 'rejected'
export type OpportunityStatus = 'new' | 'in_progress' | 'closed' | 'dismissed'

export interface SignalScore {
  relevanceScore: number
  engagementScore: number
  authorityScore: number
  revenueScore: number
  trendScore: number
  urgencyScore: number
  confidenceScore: number
  compositeScore: number
}

export interface ContentScore {
  hookScore: number
  clarityScore: number
  authorityScore: number
  engagementScore: number
  seoScore: number
  ctaScore: number
  overallScore: number
}

export interface AgentRunResult {
  signals: number
  contentItems: number
  engagementActions: number
  opportunities: number
  escalations: number
  summary: string
}

export interface DeploymentDecision {
  contentTitle: string
  platform: string
  scheduledTime: string
  reason: string
  expectedOutcome: string
  cta: string
  riskLevel: RiskLevel
}

export interface EngagementActionInput {
  actionType: string
  platform: string
  targetName: string
  targetUrl: string
  generatedResponse?: string
  requiresReview: boolean
  priorityScore: number
}

export interface OpportunityInput {
  opportunityType: string
  summary: string
  priority: Priority
  requiresReview: boolean
  recommendedAction: string
}
