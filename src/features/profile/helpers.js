// Convert between a comma-separated text field and a string array.
export const splitList = (text) =>
  (text || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const joinList = (arr) => (arr || []).join(', ')

// Compact a follower count for a stat row: 184300 -> "184.3K", 1200000 -> "1.2M".
// One decimal, and a trailing ".0" is dropped so round numbers read as "250K".
export const formatFollowers = (n) => {
  const count = Number(n) || 0
  const [divisor, suffix] =
    count >= 1e6 ? [1e6, 'M'] : count >= 1e3 ? [1e3, 'K'] : [1, '']
  const scaled = (count / divisor).toFixed(suffix ? 1 : 0)
  return scaled.replace(/\.0$/, '') + suffix
}

// profile-service serialises naive UTC datetimes ("2026-09-12T08:03:03"),
// which JS parses as *local* time. Pin them to UTC; leave anything that
// already carries a zone or offset alone.
const parseUtc = (iso) =>
  new Date(/(Z|[+-]\d{2}:?\d{2})$/.test(iso) ? iso : `${iso}Z`)

// "Last synced" as relative time. `now` is injectable so the tests don't
// depend on the wall clock.
export const formatSyncedAt = (iso, now = new Date()) => {
  if (!iso) return 'never'
  const seconds = Math.floor((now.getTime() - parseUtc(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

// --- rate cards -------------------------------------------------------------
// Vocabularies mirror profile-service's rate-card schema; anything else is a
// 422 from the server.
export const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'X' }
]

export const TYPE_OPTIONS = [
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
  { value: 'story', label: 'Story' },
  { value: 'video', label: 'Video' },
  { value: 'short', label: 'Short' },
  { value: 'live', label: 'Live' }
]

const labelOf = (options, value) =>
  (options.find((o) => o.value === value) || {}).label || value

// "Story" is the only irregular plural in the type vocabulary.
const pluralize = (label, quantity) =>
  quantity > 1 ? (label === 'Story' ? 'Stories' : `${label}s`) : label

// [{instagram, reel, 1}, {instagram, story, 3}] -> "1 Instagram Reel · 3 Instagram Stories"
export const summarizeItems = (items) =>
  (items || [])
    .map(
      (i) =>
        `${i.quantity} ${labelOf(PLATFORM_OPTIONS, i.platform)} ${pluralize(
          labelOf(TYPE_OPTIONS, i.type),
          i.quantity
        )}`
    )
    .join(' · ')

// One message per invalid package, so the editor can show it in place. The
// server re-checks everything; this only saves a pointless round trip.
export const validateRateCard = (packages) =>
  (packages || []).reduce((errors, p, index) => {
    const price = Number(p.price)
    const turnaround = Number(p.turnaround_days)
    let message = null
    if (!String(p.name || '').trim()) {
      message = 'Name is required'
    } else if (!Number.isInteger(price) || price < 1) {
      message = 'Price must be a whole dollar amount of at least $1'
    } else if (
      !Number.isInteger(turnaround) ||
      turnaround < 1 ||
      turnaround > 90
    ) {
      message = 'Turnaround must be between 1 and 90 days'
    } else if (!(p.items || []).length) {
      message = 'Add at least one item'
    } else if (
      (p.items || []).some(
        (i) =>
          !Number.isInteger(Number(i.quantity)) ||
          Number(i.quantity) < 1 ||
          Number(i.quantity) > 50
      )
    ) {
      message = 'Every item needs a whole quantity between 1 and 50'
    }
    return message ? [...errors, { index, message }] : errors
  }, [])

// Editor state -> API body. `key` is a local React list key and never sent.
export const toRateCardPayload = (hidden, packages) => ({
  hidden,
  packages: (packages || []).map((p) => ({
    name: String(p.name || '').trim(),
    price: Number(p.price),
    description: p.description || '',
    turnaround_days: Number(p.turnaround_days),
    visible: p.visible !== false,
    items: (p.items || []).map((i) => ({
      platform: i.platform,
      type: i.type,
      quantity: Number(i.quantity)
    }))
  }))
})
