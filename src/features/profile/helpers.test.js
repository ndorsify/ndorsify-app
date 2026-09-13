import {
  formatFollowers,
  formatSyncedAt,
  joinList,
  splitList
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
