import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Profile endpoints on profile-service (:6060).
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.profile),
  tagTypes: ['CreatorProfile', 'BrandProfile', 'SocialAccounts', 'RateCard'],
  endpoints: (builder) => ({
    getCreatorProfile: builder.query({
      query: (userId) => `/profiles/creators/${userId}`,
      providesTags: ['CreatorProfile']
    }),
    upsertCreatorProfile: builder.mutation({
      query: (body) => ({ url: '/profiles/creators/me', method: 'PUT', body }),
      invalidatesTags: ['CreatorProfile']
    }),
    getBrandProfile: builder.query({
      query: (userId) => `/profiles/brands/${userId}`,
      providesTags: ['BrandProfile']
    }),
    upsertBrandProfile: builder.mutation({
      query: (body) => ({ url: '/profiles/brands/me', method: 'PUT', body }),
      invalidatesTags: ['BrandProfile']
    }),

    // --- Connected social accounts (E6 §1) ---------------------------------
    // Every mutation here re-aggregates the creator's stats into
    // discovery-service's index server-side, so connecting or dropping a
    // platform changes what Discover shows.
    listMySocialAccounts: builder.query({
      query: () => '/social/mine',
      providesTags: ['SocialAccounts']
    }),
    // Starts the flow; the caller sends the browser to `connect_url`.
    // A mutation rather than a query because it mints one-shot state.
    startSocialConnect: builder.mutation({
      query: (platform) => `/social/${platform}/connect`
    }),
    // The provider's return leg. Unauthenticated by design — the signed
    // `state` is what identifies the creator after a full page redirect.
    completeSocialConnect: builder.mutation({
      query: ({ platform, state, externalAccountId }) => ({
        url: `/social/${platform}/callback`,
        params: { state, external_account_id: externalAccountId }
      }),
      invalidatesTags: ['SocialAccounts', 'CreatorProfile']
    }),
    syncSocialAccount: builder.mutation({
      query: (platform) => ({
        url: `/social/${platform}/sync`,
        method: 'POST'
      }),
      invalidatesTags: ['SocialAccounts', 'CreatorProfile']
    }),
    disconnectSocialAccount: builder.mutation({
      query: (platform) => ({ url: `/social/${platform}`, method: 'DELETE' }),
      invalidatesTags: ['SocialAccounts', 'CreatorProfile']
    }),

    // --- Rate cards (Phase 3) ---------------------------------------------
    getMyRateCard: builder.query({
      query: () => '/profiles/creators/me/rate-card',
      providesTags: ['RateCard']
    }),
    saveRateCard: builder.mutation({
      query: (body) => ({
        url: '/profiles/creators/me/rate-card',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['RateCard']
    }),
    getCreatorRateCard: builder.query({
      query: (userId) => `/profiles/creators/${userId}/rate-card`,
      providesTags: ['RateCard']
    })
  })
})

export const {
  useGetCreatorProfileQuery,
  useUpsertCreatorProfileMutation,
  useGetBrandProfileQuery,
  useUpsertBrandProfileMutation,
  useListMySocialAccountsQuery,
  useStartSocialConnectMutation,
  useCompleteSocialConnectMutation,
  useSyncSocialAccountMutation,
  useDisconnectSocialAccountMutation,
  useGetMyRateCardQuery,
  useSaveRateCardMutation,
  useGetCreatorRateCardQuery
} = profileApi
