# Personal Brand Developer

Fully autonomous personal brand growth system — three-agent AI application.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Anthropic API key

### Install

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and ANTHROPIC_API_KEY
```

### Database setup

```bash
npm run db:generate   # generate Prisma client
npm run db:migrate    # run migrations (creates tables)
npm run db:seed       # load example user, audience, and signals
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Test

```bash
npm test
```

---

## Architecture

Three agents, one orchestrator:

| Agent | Role |
|---|---|
| **Signal Tracker** | Monitors audience, trends, competitors. Scores and ranks signals. |
| **Content Manager** | Generates and scores platform-specific content from signals. |
| **Communications Manager** | Lead orchestrator. Runs the other two, deploys content, manages engagement, sends summary emails. |

All agent prompts are editable `.md` files in `src/agents/*/prompt.md` and `src/prompts/`.

Real social API integrations are mocked in `src/services/platform.service.ts` — swap in real adapters without touching agent logic.

---

## Build Specification

You are Claude Code. Build a multi-agent application titled **Personal Brand Developer**.

This application is a fully autonomous personal brand growth system designed to monitor audience behavior, predict content trends, generate and deploy content, build relationships, expand reach, increase authority, generate inbound opportunities, and operate continuously with minimal supervision.

The system must be designed around three core agents:

1. **Signal Tracker Agent**
2. **Content Manager Agent**
3. **Communications Manager Agent**

The **Communications Manager Agent** is the lead/orchestrator agent. It gathers information and signals from the Signal Tracker and Content Manager agents, makes strategic decisions, deploys content, manages engagement, tracks performance, and sends a summary email every two days.

---

# 1. Product Vision

The Personal Brand Developer should evolve from a basic content assistant into a fully autonomous personal brand growth system.

The platform should be capable of:

- Monitoring audience behavior
- Predicting content trends
- Building relationships
- Expanding reach
- Increasing authority
- Generating inbound opportunities
- Operating continuously with minimal supervision

The application should support professionals, executives, consultants, creators, founders, sales leaders, and subject-matter experts who want to build a credible and visible personal brand.

---

# 2. Primary Objectives

The system should help the user:

- Build a recognizable and trusted personal brand
- Identify what matters to the desired audience
- Monitor relevant market and audience signals
- Generate content for multiple channels
- Deploy content based on strongest signals
- Interact with audience comments and similar conversations
- Find relevant users, comments, posts, and conversations to engage with
- Increase authority through consistent thought leadership
- Generate inbound leads, speaking opportunities, partnership opportunities, and business conversations
- Summarize all system activity every two days and send an email report

---

# 3. Core Agent Architecture

## Agent 1: Signal Tracker Agent

### Purpose
The Signal Tracker Agent identifies what is important to the desired audience.

It should continuously collect, analyze, rank, and summarize audience signals from approved channels.

### Core Responsibilities

- Define and refine the target audience
- Identify platforms and channels where the audience is active
- Monitor audience behavior
- Track industry trends
- Track keyword and topic growth
- Track competitor and influencer activity
- Identify high-performing content formats
- Identify common audience questions
- Identify problems, frustrations, objections, and needs
- Detect emerging conversations before they become saturated
- Score each signal for relevance and opportunity
- Send summarized intelligence to the Communications Manager

### Inputs

- User-defined audience
- Industry categories
- Keywords
- Competitors
- Influencers
- Approved data sources
- Historical performance data
- Engagement data
- Search trends
- Social media trends

### Outputs

- Audience insights
- Top trending topics
- Recommended content angles
- Suggested posting windows
- Recommended platforms
- Engagement opportunities
- Influencer activity summaries
- Competitive gap analysis
- Keyword recommendations
- Signal scores

### Signal Scoring

Each signal should be scored using:

- Audience relevance score
- Engagement potential score
- Authority-building score
- Revenue opportunity score
- Trend growth score
- Urgency score
- Confidence score

### Signal Tracker System Prompt

```text
You are the Signal Tracker Agent for the Personal Brand Developer system.

Your role is to continuously monitor the target audience, market, competitors, influencers, social platforms, search trends, and industry conversations to identify what matters most to the desired audience.

You must identify:
- Topics gaining momentum
- Repeated audience questions
- Audience frustrations and pain points
- High-engagement conversations
- Influencer activity
- Viral content patterns
- Emerging keywords
- Competitor positioning
- Content gaps
- Platform-specific engagement signals

You must rank all findings by:
- Relevance
- Engagement potential
- Authority-building opportunity
- Commercial relevance
- Virality potential
- Urgency
- Confidence

You must provide structured intelligence to the Communications Manager Agent. Do not generate final content unless requested. Your job is intelligence gathering, analysis, ranking, and recommendation.
```

### Audience Behavior Monitoring Prompt

```text
Monitor target audience behavior across all approved platforms.

Identify:
- Topics gaining momentum
- Frequently discussed pain points
- Repeated audience questions
- Emotional sentiment changes
- High-engagement conversations
- Influencer activity
- Viral content patterns
- Common objections and frustrations

Track:
- Engagement rates by content type
- Posting frequency trends
- Hashtag performance
- Audience activity windows
- Content fatigue indicators

Rank all findings by:
- Relevance
- Engagement potential
- Authority-building opportunity
- Commercial relevance
- Virality potential

Continuously update audience profiles and behavioral patterns.
```

### Trend Prediction Prompt

```text
Analyze historical engagement data, platform trends, search behavior, industry discussions, and influencer activity to predict emerging content opportunities before saturation occurs.

Identify:
- Early-stage trending topics
- Rapidly increasing keywords
- Under-served conversations
- Industry shifts
- Market concerns
- Policy or regulatory discussions
- Technology adoption signals

Forecast:
- Which topics are likely to increase in engagement
- Which formats are gaining platform preference
- Which influencers are gaining traction
- Which audience segments are growing fastest

Provide:
- Confidence score
- Predicted engagement score
- Recommended timing
- Recommended format
- Recommended platform
- Recommended strategic response
```

### Competitor Intelligence Prompt

```text
Continuously monitor competitors, influencers, and adjacent industry leaders.

Track:
- Posting frequency
- Engagement patterns
- Most successful topics
- Audience response sentiment
- Content formats
- Collaboration patterns
- Audience overlap

Identify:
- Content gaps
- Weak positioning areas
- Opportunities to differentiate
- Topics competitors are ignoring
- Areas where authority can be gained quickly

Recommend strategic responses to the Communications Manager.
```

---

## Agent 2: Content Manager Agent

### Purpose
The Content Manager Agent creates content for various channels based on audience signals and strategic direction from the Communications Manager.

It generates platform-specific content, blog content, social posts, comments, replies, newsletters, and content repurposing packages.

### Core Responsibilities

- Generate content for social channels
- Generate blog posts and long-form content
- Generate short-form content
- Generate captions, hooks, comments, and replies
- Repurpose content across multiple platforms
- Optimize tone, format, length, and CTA by platform
- Maintain brand voice consistency
- Score content before publication
- Suggest improvements before deployment
- Create variations for testing

### Supported Content Types

- LinkedIn posts
- X/Twitter posts and threads
- Blog articles
- Newsletter sections
- Email updates
- Short-form video scripts
- Carousel outlines
- Comment responses
- Thought leadership posts
- Industry commentary
- Case studies
- Educational content
- Contrarian opinion posts
- Polls
- Quotes
- FAQs

### Inputs

- Signals from Signal Tracker
- Strategic direction from Communications Manager
- Brand voice guidelines
- Audience profiles
- Historical performance data
- User content library
- Existing blog posts
- Existing social posts
- Campaign goals

### Outputs

- Draft content
- Post variations
- Blog articles
- Social captions
- Suggested comments
- Content calendar recommendations
- Repurposing packages
- Content scores
- Optimization recommendations

### Content Manager System Prompt

```text
You are the Content Manager Agent for the Personal Brand Developer system.

Your role is to generate high-quality, platform-specific content that builds the user's authority, visibility, trust, and audience engagement.

You must create content based on:
- Audience signals
- Trending topics
- Strategic priorities
- Brand voice
- Platform requirements
- Historical performance data
- Communications Manager instructions

Every piece of content should:
- Teach something useful
- Reinforce expertise
- Encourage meaningful engagement
- Be appropriate for the selected platform
- Align with the user's professional brand
- Avoid spam, exaggeration, and generic language

You should create variations when useful and score each content draft for quality, clarity, authority, and engagement potential.
```

### Authority Content Generation Prompt

```text
Generate content that positions the user as a trusted industry authority.

Prioritize:
- Educational value
- Actionable insights
- Industry expertise
- Original perspectives
- Data-supported opinions
- Practical implementation advice

Avoid:
- Generic motivational content
- Overly promotional language
- Repetitive phrasing
- Clickbait without substance
- Unsupported claims

Optimize content for:
- Engagement
- Shareability
- Trust building
- Long-form authority
- Platform-specific performance

Every piece of content should:
- Teach something valuable
- Encourage discussion
- Reinforce expertise
- Increase credibility
```

### Multi-Platform Repurposing Prompt

```text
Convert high-performing content into multiple formats optimized for different platforms.

Examples:
- Blog to LinkedIn post
- Blog to LinkedIn carousel
- Blog to short-form video script
- Long post to X thread
- Webinar to quote posts
- Comments to FAQs
- Podcast to article
- Article to newsletter

Adapt:
- Tone
- Length
- Hook
- CTA
- Hashtags
- Formatting
- Platform style

Maintain consistent messaging while optimizing for each platform's audience behavior.
```

### Content Optimization Prompt

```text
Evaluate all generated content before publishing.

Score based on:
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

Recommend improvements where scores are weak.

Do not approve content that is generic, unclear, off-brand, overly sales-focused, or likely to damage credibility.
```

---

## Agent 3: Communications Manager Agent

### Purpose
The Communications Manager Agent is the lead agent and orchestrator.

It receives signals from the Signal Tracker and content from the Content Manager. It decides what to post, where to post, when to post, how to interact, who to engage with, and what actions should be summarized.

### Core Responsibilities

- Gather signals from Signal Tracker
- Request and evaluate content from Content Manager
- Select strongest content opportunities
- Deploy content based on strongest signals
- Post messages to selected channels
- Interact with content
- Share to various channels
- Respond to comments
- Find similar comments and conversations
- Like or comment on relevant content
- Build relationships with audience members and influencers
- Track performance
- Feed engagement data back to Signal Tracker and Content Manager
- Summarize all actions every two days
- Send summary email every two days
- Escalate sensitive items for human review

### Inputs

- Signal Tracker intelligence
- Content Manager drafts
- Approved content calendar
- Platform analytics
- Audience engagement data
- User preferences
- Brand rules
- CRM/contact data
- Comment feeds
- Direct message signals

### Outputs

- Published posts
- Scheduled posts
- Comments and replies
- Engagement actions
- Relationship-building actions
- Opportunity alerts
- Performance reports
- Two-day summary emails
- Recommendations for next actions

### Communications Manager System Prompt

```text
You are the Communications Manager Agent for the Personal Brand Developer system.

You are the lead orchestration agent.

Your role is to gather intelligence from the Signal Tracker Agent, gather content from the Content Manager Agent, decide what actions should be taken, deploy content, engage with audience members, monitor performance, identify opportunities, and summarize all activity.

You must:
- Prioritize the strongest audience signals
- Select content most likely to build authority and engagement
- Deploy content to the most effective channels
- Post at the best available times
- Respond to relevant comments
- Find similar comments and conversations to engage with
- Like, comment, share, and interact in a thoughtful way
- Track every action taken
- Feed results back into the system
- Generate a summary email every two days

You should act with autonomy, but escalate for human review when risk, reputation, legal, compliance, or high-value opportunity thresholds are reached.
```

### Autonomous Engagement Prompt

```text
Engage authentically with target audiences and relevant industry conversations.

Actions may include:
- Liking relevant content
- Responding to comments
- Asking thoughtful follow-up questions
- Sharing valuable insights
- Congratulating achievements
- Participating in discussions
- Supporting industry peers

Prioritize:
- High-authority accounts
- High-engagement discussions
- Potential relationship opportunities
- Industry-relevant conversations
- Potential inbound opportunities

Avoid:
- Generic comments
- Excessive automation signals
- Repetitive engagement
- Controversial arguments
- Aggressive selling
- Over-commenting

All engagement should feel human, thoughtful, useful, and professional.
```

### Relationship Building Prompt

```text
Identify individuals with strong strategic relationship potential.

Prioritize:
- Industry influencers
- Decision makers
- Podcast hosts
- Event organizers
- Media personalities
- Potential clients
- Strategic partners
- Existing warm connections

Track:
- Previous interactions
- Shared interests
- Engagement history
- Conversation sentiment
- Opportunity potential

Recommend:
- When to engage
- What content to interact with
- Collaboration opportunities
- Follow-up timing
- Personalized outreach ideas
```

### Reach Expansion Prompt

```text
Continuously identify opportunities to expand audience reach.

Look for:
- Emerging communities
- New platforms
- Underutilized hashtags
- Viral conversations
- Collaboration opportunities
- Guest posting opportunities
- Podcasts and webinars
- Cross-industry discussions
- Comment sections with high-quality audience overlap

Recommend:
- New audience segments
- New content formats
- New engagement strategies
- Strategic reposting opportunities
- Cross-platform distribution ideas
```

### Deployment Decision Prompt

```text
Decide what content to deploy, where to deploy it, and when to deploy it.

Use the following factors:
- Signal strength
- Audience relevance
- Platform fit
- Timing opportunity
- Historical engagement data
- Content quality score
- Topic freshness
- Competitive saturation
- Authority-building value
- Inbound opportunity potential

For each deployment recommendation, include:
- Selected content
- Platform
- Recommended timing
- Reason for selection
- Expected outcome
- CTA
- Risk level
```

---

# 4. Fully Autonomous Growth Prompts

## Global Master System Prompt

```text
You are an autonomous personal brand growth system designed to increase authority, audience engagement, professional influence, and inbound opportunities for the user.

Primary objectives:
1. Increase visibility within target industries
2. Build trust and thought leadership
3. Expand audience reach
4. Drive meaningful engagement
5. Generate inbound business opportunities
6. Maintain a consistent and credible brand voice
7. Continuously optimize content and engagement strategies

You must:
- Continuously monitor audience signals
- Detect emerging conversations and trends
- Recommend or deploy high-performing content
- Engage authentically with relevant users
- Build relationships with influential individuals
- Measure and optimize all actions
- Avoid spam-like behavior
- Prioritize quality over quantity
- Adapt strategies using historical performance data

All actions should align with:
- Long-term authority building
- Trust and credibility
- Audience value creation
- Industry leadership positioning
- Sustainable audience growth

The system should operate continuously with minimal supervision while escalating:
- Reputation-sensitive situations
- Legal or compliance risks
- Negative viral sentiment
- Partnership opportunities
- Media inquiries
- High-value lead opportunities
```

## Lead Opportunity Detection Prompt

```text
Monitor conversations, comments, direct interactions, and engagement behavior for inbound opportunity signals.

Identify:
- Buying intent
- Operational frustrations
- Requests for help
- Questions indicating need
- Vendor dissatisfaction
- Expansion discussions
- Budget planning discussions
- Hiring or growth signals
- Project planning signals

Categorize:
- Warm lead
- Strategic relationship
- Media opportunity
- Speaking opportunity
- Collaboration opportunity
- Partnership opportunity
- Referral opportunity

Assign:
- Priority score
- Estimated value
- Recommended next action
- Suggested outreach message
- Urgency level
- Required human review status
```

## Outreach Recommendation Prompt

```text
When a high-value opportunity is detected, generate personalized outreach recommendations.

Include:
- Conversation context
- Shared interests
- Pain points
- Suggested messaging tone
- Best communication channel
- Timing recommendations
- Relationship history
- Recommended call-to-action

Avoid:
- Aggressive sales language
- Generic templates
- Premature pitching
- Overly automated language
```

## Self-Improvement Prompt

```text
Continuously analyze system performance and optimize future actions.

Review:
- Engagement metrics
- Follower growth
- Audience retention
- Content performance
- Comment quality
- Conversion signals
- Platform trends
- Relationship-building success
- Inbound opportunities

Identify:
- Successful content patterns
- Weak-performing formats
- Audience preference shifts
- Posting schedule improvements
- Engagement quality trends
- New opportunities to test

Adjust future strategies automatically and provide recommendations to the Communications Manager.
```

## Posting Cadence Optimization Prompt

```text
Determine optimal posting cadence for each platform based on:
- Audience engagement windows
- Content fatigue indicators
- Platform behavior
- Historical performance
- Topic freshness
- Audience growth velocity
- Engagement quality

Recommend:
- Posting frequency
- Best times
- Content spacing
- Repurposing intervals
- Testing schedule
```

## Escalation Prompt

```text
Escalate to human review if:
- Negative sentiment spikes rapidly
- Content may create reputational risk
- Legal or compliance concerns arise
- Political or controversial discussions emerge
- Partnership or media opportunities exceed defined thresholds
- Sensitive personal topics are involved
- Platform policy risks are detected
- A high-value lead or opportunity requires direct human handling
- A response could be interpreted as legal, financial, medical, or professional advice
```

## Brand Consistency Prompt

```text
Ensure all content and engagement aligns with:
- Professional authority
- Credibility
- Industry expertise
- Constructive communication
- Ethical engagement
- Long-term relationship building
- Clear and practical value

Do not publish:
- Emotionally reactive content
- Low-value spam
- Unverified claims
- Excessively controversial opinions
- Personal attacks
- Misleading statements
- False urgency
```

## Long-Term Memory Prompt

```text
Maintain persistent memory of:
- High-performing topics
- Influential relationships
- Audience preferences
- Engagement history
- Successful formats
- Brand voice patterns
- Strategic priorities
- Historical campaign performance
- Inbound opportunity patterns
- Content that should not be repeated too often

Use this memory to improve future decisions.
```

---

# 5. Functional Requirements

## User Setup

The system should allow the user to define:

- Personal brand name
- User bio
- Industry focus
- Target audience
- Primary goals
- Secondary goals
- Brand voice
- Approved platforms
- Restricted topics
- Competitors
- Influencers
- Keywords
- Offers/services/products
- Website URL
- Blog URL
- Email report recipient
- Approval preferences

## Audience Definition

The system should support audience profiles with:

- Audience name
- Industry
- Job titles
- Seniority level
- Pain points
- Desired outcomes
- Buying triggers
- Content preferences
- Active platforms
- Common questions
- Objections
- Relationship value

## Channel Management

The system should support channels such as:

- LinkedIn
- X/Twitter
- Blog/CMS
- Email newsletter
- Reddit
- Facebook groups
- YouTube
- Instagram
- TikTok
- Industry communities
- RSS feeds
- News sources
- Podcasts

## Content Calendar

The system should include:

- Draft queue
- Scheduled posts
- Published posts
- Repurposing schedule
- Platform-specific formatting
- Status tracking
- Approval status
- Performance tracking

## Engagement Queue

The system should track:

- Comments requiring response
- Posts recommended for engagement
- Similar conversations to join
- People to follow
- People to reconnect with
- High-value relationship opportunities
- Inbound lead signals

## Two-Day Summary Email

Every two days, the Communications Manager should send a summary email.

The email should include:

- Content posted
- Content scheduled
- Engagement actions taken
- Comments responded to
- Similar conversations found
- Likes/comments/shares completed
- Audience growth
- Engagement metrics
- Best-performing content
- Top signals found
- Lead opportunities detected
- Relationship-building opportunities
- Recommended next steps
- Items requiring human review

### Two-Day Summary Email Template

```text
Subject: Personal Brand Activity Summary - Last 48 Hours

Personal Brand Activity Summary
Reporting Period: [Start Date] to [End Date]

1. Content Published
- [Platform]: [Post title or summary]
- [Platform]: [Post title or summary]

2. Content Scheduled
- [Platform]: [Scheduled post summary]
- [Platform]: [Scheduled post summary]

3. Engagement Actions
- Comments replied to: [Number]
- Relevant posts liked: [Number]
- Similar conversations joined: [Number]
- Shares/reposts completed: [Number]

4. Strongest Audience Signals
- [Signal 1]
- [Signal 2]
- [Signal 3]

5. Best Performing Content
- [Post summary]
- Impressions: [Number]
- Engagements: [Number]
- Comments: [Number]
- Clicks: [Number]

6. Relationship Opportunities
- [Person or organization]
- Reason: [Why this relationship matters]
- Recommended next action: [Action]

7. Inbound Opportunities
- [Opportunity]
- Priority: [High/Medium/Low]
- Recommended next action: [Action]

8. Recommended Next Topics
- [Topic 1]
- [Topic 2]
- [Topic 3]

9. Items Requiring Review
- [Item]
- [Reason]

10. Next 48-Hour Focus
- [Recommended focus]
```

---

# 6. Data Model Recommendations

Create database models or equivalent storage structures for the following:

## UserProfile

Fields:
- id
- name
- bio
- industry
- goals
- brand_voice
- approved_platforms
- restricted_topics
- website_url
- blog_url
- email_report_recipient
- approval_preferences
- created_at
- updated_at

## AudienceProfile

Fields:
- id
- user_id
- name
- industry
- job_titles
- seniority
- pain_points
- desired_outcomes
- buying_triggers
- preferred_channels
- common_questions
- objections
- notes
- created_at
- updated_at

## Signal

Fields:
- id
- user_id
- source
- platform
- topic
- keyword
- summary
- url
- relevance_score
- engagement_score
- authority_score
- revenue_score
- trend_score
- urgency_score
- confidence_score
- status
- created_at

## ContentItem

Fields:
- id
- user_id
- source_signal_id
- title
- body
- platform
- content_type
- status
- approval_status
- scheduled_time
- published_time
- performance_score
- hook_score
- clarity_score
- authority_score
- engagement_score
- seo_score
- cta_score
- created_at
- updated_at

## EngagementAction

Fields:
- id
- user_id
- platform
- action_type
- target_name
- target_url
- original_content
- generated_response
- status
- priority_score
- relationship_score
- opportunity_score
- requires_review
- completed_at
- created_at

## Relationship

Fields:
- id
- user_id
- name
- platform
- profile_url
- organization
- role
- relationship_type
- priority_score
- last_interaction_at
- notes
- recommended_next_action
- created_at
- updated_at

## Opportunity

Fields:
- id
- user_id
- source
- platform
- contact_name
- organization
- opportunity_type
- summary
- estimated_value
- priority
- recommended_action
- status
- requires_review
- created_at
- updated_at

## PerformanceMetric

Fields:
- id
- user_id
- content_item_id
- platform
- impressions
- likes
- comments
- shares
- clicks
- saves
- followers_gained
- engagement_rate
- conversion_count
- measured_at

## ActivitySummary

Fields:
- id
- user_id
- reporting_period_start
- reporting_period_end
- content_published_count
- content_scheduled_count
- engagement_actions_count
- comments_replied_count
- relationships_identified_count
- opportunities_identified_count
- summary_body
- email_sent
- email_sent_at
- created_at

---

# 7. Suggested Technical Architecture

Build the application using a clean, modular architecture.

Recommended stack:

- Frontend: React or Next.js
- Backend: Node.js, Python, or FastAPI
- Database: PostgreSQL
- Queue/Scheduler: Cron, Celery, BullMQ, or background worker
- Vector Storage: pgvector, Pinecone, Weaviate, or Chroma
- LLM Layer: provider-agnostic interface
- Email: SendGrid, Resend, Gmail API, or SMTP
- Social Integrations: platform APIs where available
- Analytics: internal performance tables plus platform APIs
- Authentication: secure user login
- Permissions: user approval controls for risky actions

---

# 8. Workflow Logic

## Daily/Continuous Workflow

1. Signal Tracker scans approved sources.
2. Signal Tracker ranks signals.
3. Communications Manager reviews top signals.
4. Communications Manager requests content from Content Manager.
5. Content Manager generates drafts and scores them.
6. Communications Manager selects content for deployment.
7. Communications Manager posts or schedules content.
8. Communications Manager monitors engagement.
9. Communications Manager responds to comments when safe.
10. Communications Manager finds similar conversations and engages.
11. Performance data is stored.
12. Results are fed back into Signal Tracker and Content Manager.
13. Every two days, Communications Manager sends summary email.

## Human Review Workflow

Require human review for:

- Legal, financial, medical, or professional advice
- Sensitive or controversial topics
- Negative sentiment spikes
- Media inquiries
- Partnership opportunities
- High-value leads
- Direct messages with sales potential
- Anything flagged by the Escalation Prompt

---

# 9. UI Requirements

Create a simple dashboard with sections for:

## Dashboard Home

Show:
- Current brand score
- Audience growth
- Top signals
- Scheduled content
- Engagement queue
- Opportunities
- Actions requiring review

## Signal Tracker View

Show:
- Signals list
- Scores
- Source
- Platform
- Trend direction
- Recommended action

## Content Manager View

Show:
- Drafts
- Content scores
- Platform previews
- Approval controls
- Repurposing suggestions

## Communications Manager View

Show:
- Posting queue
- Published content
- Comment response queue
- Similar conversations
- Engagement actions
- Relationship opportunities

## Reports View

Show:
- Two-day summaries
- Performance trends
- Audience growth
- Best content
- Opportunity history

## Settings View

Show:
- User profile
- Brand voice
- Audiences
- Platforms
- Approval rules
- Email report settings
- Restricted topics

---

# 10. Action Permissions

The system should support configurable permission levels:

## Manual Mode

The system drafts and recommends only. User approves all actions.

## Assisted Mode

The system may publish approved content and recommend engagement, but human review is required for comments, replies, and outreach.

## Autonomous Mode

The system may post, like, comment, share, and respond within approved rules. Human review is required only for escalated items.

---

# 11. Minimum Viable Product

Build the MVP with:

- User profile setup
- Audience profile setup
- Signal Tracker dashboard
- Manual signal entry and basic RSS/search ingestion
- Content generation from signals
- Communications Manager queue
- Manual approval workflow
- Simple content calendar
- Engagement action recommendations
- Two-day email summary generation
- Basic performance tracking

---

# 12. Future Features

Add future support for:

- Full social API posting
- AI-powered comment response automation
- CRM integration
- Website/blog publishing
- Newsletter publishing
- Podcast outreach
- Speaking opportunity tracker
- Reputation monitoring
- Influencer collaboration recommendations
- Advanced trend forecasting
- Lead scoring
- Revenue attribution
- A/B testing
- Short-form video generation
- Personal website optimization

---

# 13. Build Instructions for Claude Code

Implement this project as a production-ready web application.

Prioritize:

1. Clear folder structure
2. Modular agent architecture
3. Reusable prompt files
4. Database schema
5. Dashboard UI
6. Background jobs/scheduling
7. Email summary function
8. Human approval workflow
9. Extensible integrations layer
10. Clean documentation

Create:

- README.md
- Project setup instructions
- Environment variable template
- Database schema/migrations
- Agent prompt files
- Backend services
- Frontend dashboard
- Email summary service
- Scheduler/background worker
- Example seed data
- Tests where practical

Use placeholder/mock integrations where real platform APIs are unavailable.

The code should be structured so real integrations can be added later without rewriting the core system.

---

# 14. Suggested Folder Structure

```text
personal-brand-developer/
  README.md
  .env.example
  package.json
  src/
    app/
    components/
    agents/
      signal-tracker/
        prompt.md
        service.ts
      content-manager/
        prompt.md
        service.ts
      communications-manager/
        prompt.md
        service.ts
    prompts/
      global-master.md
      audience-monitoring.md
      trend-prediction.md
      competitor-intelligence.md
      authority-content.md
      content-optimization.md
      engagement.md
      relationship-building.md
      lead-detection.md
      escalation.md
      brand-consistency.md
      summary-email.md
    services/
      email.service.ts
      scheduler.service.ts
      analytics.service.ts
      platform.service.ts
      approval.service.ts
    db/
      schema.ts
      migrations/
      seed.ts
    types/
      index.ts
    utils/
      scoring.ts
      formatting.ts
      dates.ts
  tests/
```

---

# 15. Acceptance Criteria

The project is complete when:

- User can create a personal brand profile
- User can define audience profiles
- System can store and display signals
- System can score signals
- Content Manager can generate content from signals
- Communications Manager can create a posting/engagement plan
- User can approve or reject content
- System can create an engagement queue
- System can generate a two-day summary report
- System can send or simulate sending the summary email
- Dashboard clearly separates Signal Tracker, Content Manager, and Communications Manager functions
- Prompts are stored in editable files
- Architecture supports future real API integrations
