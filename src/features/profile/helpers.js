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
