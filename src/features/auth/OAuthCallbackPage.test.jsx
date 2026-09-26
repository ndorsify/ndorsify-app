import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import authReducer from './authSlice'
import { authApi } from './authApi'
import OAuthCallbackPage from './OAuthCallbackPage'

const user = userEvent.setup()

const jsonResponse = (body) => {
  const res = {
    ok: true,
    status: 200,
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify(body),
    json: async () => body
  }
  res.clone = () => res
  return res
}

const renderAt = (search) => {
  const store = configureStore({
    reducer: { auth: authReducer, [authApi.reducerPath]: authApi.reducer },
    middleware: (gdm) => gdm().concat(authApi.middleware)
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/oauth/callback${search}`]}>
        <Routes>
          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          <Route path="/onboarding" element={<h1>Onboarding</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
  return store
}

beforeEach(() => {
  global.fetch = vi.fn()
})
afterEach(() => {
  delete global.fetch
  vi.restoreAllMocks()
})

test('a returning user is exchanged for a session and sent on', async () => {
  global.fetch.mockResolvedValueOnce(
    jsonResponse({ access_token: 'acc-1', refresh_token: 'ref-1' })
  )
  const store = renderAt('?handoff=hand-1')

  expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  expect(store.getState().auth.accessToken).toBe('acc-1')

  const request = global.fetch.mock.calls[0][0]
  expect(request.url).toContain('/auth/oauth/exchange')
  expect(await request.json()).toEqual({ handoff: 'hand-1' })
})

test('a first sign-in asks for a role before creating anything', async () => {
  const store = renderAt('?signup=sign-1')

  expect(
    await screen.findByRole('heading', { name: /how will you use ndorsify/i })
  ).toBeInTheDocument()
  // Nothing has been created, and no call made, until a role is chosen.
  expect(global.fetch).not.toHaveBeenCalled()
  expect(store.getState().auth.accessToken).toBeNull()

  global.fetch.mockResolvedValueOnce(
    jsonResponse({
      user: { id: 5, email: 'c@example.com', role: 'creator' },
      tokens: { access_token: 'acc-2', refresh_token: 'ref-2' }
    })
  )
  await user.click(screen.getByRole('button', { name: /i'm a creator/i }))
  await user.click(screen.getByRole('button', { name: /create my account/i }))

  // Creators land in onboarding, the same as the password signup.
  expect(await screen.findByText('Onboarding')).toBeInTheDocument()
  expect(await global.fetch.mock.calls[0][0].json()).toEqual({
    signup: 'sign-1',
    role: 'creator'
  })
  expect(store.getState().auth.user.role).toBe('creator')
})

test('an expired handoff explains itself instead of hanging', async () => {
  const failed = {
    ok: false,
    status: 400,
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify({ detail: 'This link has expired' }),
    json: async () => ({ detail: 'This link has expired' })
  }
  failed.clone = () => failed
  global.fetch.mockResolvedValueOnce(failed)

  renderAt('?handoff=stale')
  expect(await screen.findByRole('alert')).toHaveTextContent('This link has expired')
  expect(screen.getByRole('link', { name: /back to sign in/i })).toBeInTheDocument()
})

test('landing with neither parameter is a dead end, not a spinner', async () => {
  renderAt('')
  await waitFor(() =>
    expect(screen.getByRole('alert')).toHaveTextContent(/missing something/i)
  )
  expect(global.fetch).not.toHaveBeenCalled()
})
