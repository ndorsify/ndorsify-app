import { joinList, splitList } from './helpers'

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
