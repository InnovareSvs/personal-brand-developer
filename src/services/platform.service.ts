/**
 * Platform Integration Service — Mock Implementation
 *
 * Each platform adapter exports a publish() function and a fetchEngagement() function.
 * Replace the mock bodies with real API calls when credentials are available.
 *
 * Supported platforms: linkedin, twitter, blog, newsletter (all mocked)
 */

export interface PublishResult {
  success: boolean
  postId?: string
  url?: string
  error?: string
}

export interface PlatformAdapter {
  publish(content: { title: string; body: string; contentType: string }): Promise<PublishResult>
  fetchEngagement(postId: string): Promise<{ likes: number; comments: number; shares: number; impressions: number }>
}

function mockAdapter(platform: string): PlatformAdapter {
  return {
    async publish(content) {
      console.log(`[Platform:${platform}] Mock publish: "${content.title.slice(0, 50)}"`)
      return {
        success: true,
        postId: `mock-${platform}-${Date.now()}`,
        url: `https://${platform}.com/mock-post-${Date.now()}`,
      }
    },
    async fetchEngagement(postId) {
      console.log(`[Platform:${platform}] Mock fetch engagement for ${postId}`)
      return {
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 10),
        shares: Math.floor(Math.random() * 5),
        impressions: Math.floor(Math.random() * 1000) + 100,
      }
    },
  }
}

const adapters: Record<string, PlatformAdapter> = {
  linkedin: mockAdapter('linkedin'),
  twitter: mockAdapter('twitter'),
  blog: mockAdapter('blog'),
  newsletter: mockAdapter('newsletter'),
  instagram: mockAdapter('instagram'),
  youtube: mockAdapter('youtube'),
  reddit: mockAdapter('reddit'),
}

export function getPlatformAdapter(platform: string): PlatformAdapter {
  return adapters[platform.toLowerCase()] ?? mockAdapter(platform)
}
