export function formatPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    linkedin: 'LinkedIn',
    twitter: 'X / Twitter',
    blog: 'Blog',
    newsletter: 'Newsletter',
    reddit: 'Reddit',
    instagram: 'Instagram',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    facebook: 'Facebook',
  }
  return labels[platform.toLowerCase()] ?? platform
}

export function formatScore(score: number, max = 1): string {
  if (max === 1) return `${Math.round(score * 100)}%`
  return `${score.toFixed(1)} / ${max}`
}

export function truncate(text: string, length = 120): string {
  if (text.length <= length) return text
  return text.slice(0, length).trimEnd() + '…'
}

export function formatContentType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
