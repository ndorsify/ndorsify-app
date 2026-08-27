import reducer, {
  credentialsReceived,
  loggedOut,
  selectIsAuthed,
  userLoaded
} from './authSlice'

const initial = { accessToken: null, refreshToken: null, user: null }

test('starts unauthenticated', () => {
  expect(reducer(undefined, { type: '@@INIT' })).toEqual(initial)
  expect(selectIsAuthed({ auth: initial })).toBe(false)
})

test('credentialsReceived stores tokens and user', () => {
  const state = reducer(
    initial,
    credentialsReceived({
      access_token: 'a',
      refresh_token: 'r',
      user: { id: 1, email: 'x@y.z', role: 'creator' }
    })
  )
  expect(state.accessToken).toBe('a')
  expect(state.refreshToken).toBe('r')
  expect(state.user.email).toBe('x@y.z')
  expect(selectIsAuthed({ auth: state })).toBe(true)
})

test('credentialsReceived without user keeps existing user (refresh case)', () => {
  const withUser = { accessToken: 'a', refreshToken: 'r', user: { id: 1 } }
  const state = reducer(
    withUser,
    credentialsReceived({ access_token: 'a2', refresh_token: 'r2' })
  )
  expect(state.accessToken).toBe('a2')
  expect(state.user).toEqual({ id: 1 })
})

test('userLoaded sets the user', () => {
  const state = reducer(initial, userLoaded({ id: 2, role: 'brand' }))
  expect(state.user.role).toBe('brand')
})

test('loggedOut clears everything', () => {
  const authed = { accessToken: 'a', refreshToken: 'r', user: { id: 1 } }
  expect(reducer(authed, loggedOut())).toEqual(initial)
})
