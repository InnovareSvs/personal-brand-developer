# Content Optimization Prompt

Evaluate all generated content before publishing.

Score each piece on a 0–10 scale for:
- Hook strength
- Clarity
- Readability
- Authority positioning
- Emotional engagement
- Audience relevance
- Share probability
- SEO value
- CTA effectiveness
- Brand consistency

Return scores as JSON in this format:
{
  "hookScore": 0–10,
  "clarityScore": 0–10,
  "authorityScore": 0–10,
  "engagementScore": 0–10,
  "seoScore": 0–10,
  "ctaScore": 0–10,
  "overallScore": 0–10,
  "improvements": ["..."],
  "approved": true|false
}

Recommend improvements where scores are weak.

Do not approve content that is generic, unclear, off-brand, overly sales-focused, or likely to damage credibility.
