import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'
import { credentialsReceived, userLoaded } from './authSlice'

// Auth endpoints on users-service (:1000).
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.users),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled // {user, tokens, verification_token?}
          dispatch(credentialsReceived({ ...data.tokens, user: data.user }))
        } catch {
          /* surfaced to the caller by unwrap(); nothing to store */
        }
      }
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled // TokenPair
          dispatch(credentialsReceived(data))
        } catch {
          /* surfaced to the caller by unwrap(); nothing to store */
        }
      }
    }),
    me: builder.query({
      query: () => '/auth/me',
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(userLoaded(data))
        } catch {
          /* handled by baseQuery reauth / route guard */
        }
      }
    }),
    // Google sends the browser back to /oauth/callback with a one-time
    // reference; these trade it for a real session. (The sign-in itself starts
    // with a plain link to users-service, not a fetch — the provider needs a
    // top-level navigation.)
    oauthExchange: builder.mutation({
      query: (handoff) => ({
        url: '/auth/oauth/exchange',
        method: 'POST',
        body: { handoff }
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled // TokenPair
          dispatch(credentialsReceived(data))
        } catch {
          /* surfaced to the caller by unwrap(); nothing to store */
        }
      }
    }),
    oauthComplete: builder.mutation({
      query: ({ signup, role }) => ({
        url: '/auth/oauth/complete',
        method: 'POST',
        body: { signup, role }
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled // {user, tokens}
          dispatch(credentialsReceived({ ...data.tokens, user: data.user }))
        } catch {
          /* surfaced to the caller by unwrap(); nothing to store */
        }
      }
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body })
    }),
    logout: builder.mutation({
      query: (body) => ({ url: '/auth/logout', method: 'POST', body })
    })
  })
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
  useOauthExchangeMutation,
  useOauthCompleteMutation,
  useForgotPasswordMutation,
  useLogoutMutation
} = authApi
