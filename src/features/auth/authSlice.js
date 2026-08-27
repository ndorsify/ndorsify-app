import { createSlice } from '@reduxjs/toolkit'

// Access token lives in memory; refresh token + user are persisted (see store.js).
const initialState = {
  accessToken: null,
  refreshToken: null,
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Accepts a TokenPair ({access_token, refresh_token}) optionally with `user`.
    credentialsReceived(state, { payload }) {
      state.accessToken = payload.access_token ?? state.accessToken
      state.refreshToken = payload.refresh_token ?? state.refreshToken
      if (payload.user) state.user = payload.user
    },
    userLoaded(state, { payload }) {
      state.user = payload
    },
    loggedOut() {
      return { ...initialState }
    }
  }
})

export const { credentialsReceived, userLoaded, loggedOut } = authSlice.actions

export const selectAccessToken = (s) => s.auth.accessToken
export const selectRefreshToken = (s) => s.auth.refreshToken
export const selectUser = (s) => s.auth.user
export const selectIsAuthed = (s) =>
  Boolean(s.auth.accessToken || s.auth.refreshToken)

export default authSlice.reducer
