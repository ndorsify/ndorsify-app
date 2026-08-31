import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Discovery endpoints on discovery-service (:9000).
export const discoveryApi = createApi({
  reducerPath: 'discoveryApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.discovery),
  tagTypes: ['Shortlist'],
  endpoints: (builder) => ({
    searchCreators: builder.query({
      // params: { q, niche: [], platform: [], min_followers, max_followers,
      //   min_engagement, min_rate, max_rate, verified, location, sort }
      query: (params = {}) => {
        const search = new URLSearchParams()
        if (params.q) search.set('q', params.q)
        ;(params.niche || []).forEach((n) => search.append('niche', n))
        ;(params.platform || []).forEach((p) => search.append('platform', p))
        if (params.min_followers != null)
          search.set('min_followers', params.min_followers)
        if (params.max_followers != null)
          search.set('max_followers', params.max_followers)
        if (params.min_engagement != null)
          search.set('min_engagement', params.min_engagement)
        if (params.min_rate != null) search.set('min_rate', params.min_rate)
        if (params.max_rate != null) search.set('max_rate', params.max_rate)
        if (params.verified) search.set('verified', 'true')
        if (params.location) search.set('location', params.location)
        if (params.sort) search.set('sort', params.sort)
        return `/discovery/creators?${search.toString()}`
      }
    }),
    getCreator: builder.query({
      query: (userId) => `/discovery/creators/${userId}`
    }),
    createShortlist: builder.mutation({
      query: (body) => ({ url: '/discovery/shortlists', method: 'POST', body })
    }),
    addToShortlist: builder.mutation({
      query: ({ shortlistId, creatorId }) => ({
        url: `/discovery/shortlists/${shortlistId}/items`,
        method: 'POST',
        body: { creator_id: creatorId }
      }),
      invalidatesTags: ['Shortlist']
    }),
    getShortlist: builder.query({
      query: (shortlistId) => `/discovery/shortlists/${shortlistId}`,
      providesTags: ['Shortlist']
    })
  })
})

export const {
  useSearchCreatorsQuery,
  useLazySearchCreatorsQuery,
  useGetCreatorQuery,
  useCreateShortlistMutation,
  useAddToShortlistMutation,
  useGetShortlistQuery
} = discoveryApi
