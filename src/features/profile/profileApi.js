import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Profile endpoints on profile-service (:6000).
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.profile),
  tagTypes: ['CreatorProfile', 'BrandProfile'],
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
    })
  })
})

export const {
  useGetCreatorProfileQuery,
  useUpsertCreatorProfileMutation,
  useGetBrandProfileQuery,
  useUpsertBrandProfileMutation
} = profileApi
