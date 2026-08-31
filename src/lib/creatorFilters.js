// Shared creator-search helpers used by DiscoverPage (brand browsing) and
// CampaignBuilderPage's Shortlist step (brand inviting from within a
// campaign draft) — both search the same discovery-service creator index.

export const SIZE_BUCKETS = [
  { key: 'nano', label: 'Nano · <10K', min: 0, max: 9999 },
  { key: 'micro', label: 'Micro · 10–100K', min: 10000, max: 99999 },
  { key: 'mid', label: 'Mid · 100–500K', min: 100000, max: 499999 },
  { key: 'macro', label: 'Macro · 500K+', min: 500000, max: null }
]

// Multi-select bucket keys → a single follower range for the query.
export const followersRange = (sizeKeys) => {
  if (!sizeKeys.length) return {}
  const chosen = SIZE_BUCKETS.filter((b) => sizeKeys.includes(b.key))
  const range = { min_followers: Math.min(...chosen.map((b) => b.min)) }
  const maxes = chosen.map((b) => b.max)
  if (!maxes.includes(null)) range.max_followers = Math.max(...maxes)
  return range
}

export const compact = (n) => {
  const v = Number(n)
  if (!v) return '—'
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${Math.round(v / 1000)}K`
  return `${v}`
}

// discovery-service search result -> the flat shape both screens render.
export const toCreatorCard = (c) => ({
  id: c.user_id,
  initials: (c.display_name || 'C').slice(0, 2).toUpperCase(),
  name: c.display_name || `Creator #${c.user_id}`,
  handle: c.handle ? `@${c.handle}` : `#${c.user_id}`,
  location: c.location || '—',
  niche: (c.niches || [])[0] || 'Creator',
  platform: (c.platforms || [])[0] || '—',
  followers: compact(c.follower_count),
  followerCount: c.follower_count || 0,
  engagement: c.engagement_rate ? `${c.engagement_rate}%` : '—',
  rating: c.avg_rating ? `${c.avg_rating}★` : '—',
  rate: c.rate_per_post || null
})
