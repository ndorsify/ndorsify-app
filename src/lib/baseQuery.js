import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { SERVICE_URLS } from './config'
import { credentialsReceived, loggedOut } from '../features/auth/authSlice'

// A fetchBaseQuery that attaches the in-memory access token.
const rawBaseQuery = (baseUrl) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    }
  })

// Single-flight refresh: concurrent 401s share one /auth/refresh call.
let refreshPromise = null

/**
 * Wrap a service's base query so a 401 triggers one refresh (against
 * users-service) and a retry. On refresh failure, the session is cleared.
 */
export const makeBaseQueryWithReauth = (baseUrl) => {
  const baseQuery = rawBaseQuery(baseUrl)
  const usersQuery = rawBaseQuery(SERVICE_URLS.users)

  return async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
      const refreshToken = api.getState().auth.refreshToken
      if (!refreshToken) {
        api.dispatch(loggedOut())
        return result
      }
      if (!refreshPromise) {
        refreshPromise = usersQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refresh_token: refreshToken }
          },
          api,
          extraOptions
        )
      }
      const refreshResult = await refreshPromise
      refreshPromise = null

      if (refreshResult.data) {
        api.dispatch(credentialsReceived(refreshResult.data))
        result = await baseQuery(args, api, extraOptions) // retry original
      } else {
        api.dispatch(loggedOut())
      }
    }
    return result
  }
}
