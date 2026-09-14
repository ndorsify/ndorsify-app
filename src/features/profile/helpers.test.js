import {
  formatFollowers,
  formatSyncedAt,
  joinList,
  splitList,
  summarizeItems,
  validateRateCard,
  toRateCardPayload
} from './helpers'

test('splitList trims, drops empties', () => {
  expect(splitList('tech, food ,, gaming ')).toEqual(['tech', 'food', 'gaming'])
  expect(splitList('')).toEqual([])
  expect(splitList(undefined)).toEqual([])
})

test('joinList round-trips', () => {
  expect(joinList(['a', 'b'])).toBe('a, b')
  expect(joinList([])).toBe('')
  expect(splitList(joinList(['x', 'y', 'z']))).toEqual(['x', 'y', 'z'])
})

test('formatFollowers compacts at thousand and million boundaries', () => {
  expect(formatFollowers(0)).toBe('0')
  expect(formatFollowers(842)).toBe('842')
  expect(formatFollowers(1000)).toBe('1K')
  expect(formatFollowers(184300)).toBe('184.3K')
  expect(formatFollowers(250000)).toBe('250K')
  expect(formatFollowers(1200000)).toBe('1.2M')
})

test('formatFollowers treats missing counts as zero', () => {
  expect(formatFollowers(undefined)).toBe('0')
  expect(formatFollowers(null)).toBe('0')
})

test('formatSyncedAt reads as relative time', () => {
  const now = new Date('2026-09-12T12:00:00Z')
  const ago = (ms) => new Date(now.getTime() - ms).toISOString()
  expect(formatSyncedAt(ago(30 * 1000), now)).toBe('just now')
  expect(formatSyncedAt(ago(5 * 60 * 1000), now)).toBe('5m ago')
  expect(formatSyncedAt(ago(3 * 3600 * 1000), now)).toBe('3h ago')
  expect(formatSyncedAt(ago(2 * 86400 * 1000), now)).toBe('2d ago')
  expect(formatSyncedAt(undefined, now)).toBe('never')
})

test('formatSyncedAt reads naive timestamps as UTC, not local time', () => {
  // profile-service serialises naive UTC datetimes with no "Z" suffix, which
  // JS would otherwise parse as local time — an account connected seconds ago
  // then reads as hours old for anyone not on UTC.
  const now = new Date('2026-09-12T08:03:33Z')
  expect(formatSyncedAt('2026-09-12T08:03:03', now)).toBe('just now')
  // An explicit offset must still be respected.
  expect(formatSyncedAt('2026-09-12T08:03:03Z', now)).toBe('just now')
  expect(formatSyncedAt('2026-09-12T13:33:03+05:30', now)).toBe('just now')
})

const reel = { platform: 'instagram', type: 'reel', quantity: 1 }
const stories = { platform: 'instagram', type: 'story', quantity: 3 }

test('summarizeItems reads as a sentence fragment', () => {
  expect(summarizeItems([reel])).toBe('1 Instagram Reel')
  expect(summarizeItems([reel, stories])).toBe(
    '1 Instagram Reel · 3 Instagram Stories'
  )
  expect(summarizeItems([{ platform: 'twitter', type: 'post', quantity: 2 }])).toBe(
    '2 X Posts'
  )
  expect(summarizeItems([])).toBe('')
  expect(summarizeItems(undefined)).toBe('')
})

const pkg = (over = {}) => ({
  name: 'Single Reel',
  price: 1600,
  description: '',
  turnaround_days: 5,
  visible: true,
  items: [reel],
  ...over
})

test('validateRateCard accepts a good card', () => {
  expect(validateRateCard([pkg()])).toEqual([])
  expect(validateRateCard([])).toEqual([])
})

test('validateRateCard reports one message per bad package', () => {
  expect(validateRateCard([pkg({ name: '  ' })])).toEqual([
    { index: 0, message: 'Name is required' }
  ])
  expect(validateRateCard([pkg({ price: '' })])).toEqual([
    { index: 0, message: 'Price must be a whole dollar amount of at least $1' }
  ])
  expect(validateRateCard([pkg({ price: 12.5 })])[0].message).toMatch(/whole dollar/)
  expect(validateRateCard([pkg({ turnaround_days: 0 })])).toEqual([
    { index: 0, message: 'Turnaround must be between 1 and 90 days' }
  ])
  expect(validateRateCard([pkg({ items: [] })])).toEqual([
    { index: 0, message: 'Add at least one item' }
  ])
})

test('validateRateCard reports the index of each bad package', () => {
  expect(validateRateCard([pkg(), pkg({ price: 0 })])).toEqual([
    { index: 1, message: 'Price must be a whole dollar amount of at least $1' }
  ])
})

test('toRateCardPayload drops local-only keys and coerces numbers', () => {
  expect(
    toRateCardPayload(true, [
      { ...pkg({ price: '1600', turnaround_days: '5' }), key: 'local-1' }
    ])
  ).toEqual({
    hidden: true,
    packages: [
      {
        name: 'Single Reel',
        price: 1600,
        description: '',
        turnaround_days: 5,
        visible: true,
        items: [{ platform: 'instagram', type: 'reel', quantity: 1 }]
      }
    ]
  })
})
