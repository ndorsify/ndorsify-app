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
        const { data } = await queryFulfilled // {user, tokens, verification_token?}
        dispatch(credentialsReceived({ ...data.tokens, user: data.user }))
      }
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled // TokenPair
        dispatch(credentialsReceived(data))
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
  useForgotPasswordMutation,
  useLogoutMutation
} = authApi
