import { afterEach, beforeEach, expect, test, vi } from 'vitest'

// config.js reads import.meta.env at module load, so each case re-imports it.
const load = async () => {
  vi.resetModules()
  return (await import('./config')).SERVICE_URLS
}

beforeEach(() => vi.unstubAllEnvs())
afterEach(() => vi.unstubAllEnvs())

test('falls back to the seven local ports when no base is set', async () => {
  const urls = await load()
  expect(urls.users).toBe('http://localhost:1000')
  expect(urls.collaboration).toBe('http://localhost:4000')
})

test('per-service overrides still win locally', async () => {
  vi.stubEnv('REACT_APP_MESSAGING_URL', 'http://localhost:3001')
  expect((await load()).messaging).toBe('http://localhost:3001')
})

test('a base collapses every service onto one origin', async () => {
  vi.stubEnv('REACT_APP_API_BASE', '/api')
  const urls = await load()
  // One base for all seven: each slice's own paths (/auth/login, /campaigns,
  // /discovery/creators) are what the deployed services already serve.
  expect(new Set(Object.values(urls))).toEqual(new Set(['/api']))
})

test('the base wins over a stale per-service override', async () => {
  vi.stubEnv('REACT_APP_API_BASE', '/api')
  vi.stubEnv('REACT_APP_USERS_URL', 'http://localhost:1000')
  expect((await load()).users).toBe('/api')
})

test('a trailing slash on the base is trimmed', async () => {
  vi.stubEnv('REACT_APP_API_BASE', 'https://api.ndorsify.com/')
  expect((await load()).users).toBe('https://api.ndorsify.com')
})
