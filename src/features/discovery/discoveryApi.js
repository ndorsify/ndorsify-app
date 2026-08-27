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
      // params: { q, niche: [], min_followers, max_followers, min_engagement, location, sort }
      query: (params) => {
        const search = new URLSearchParams()
        if (params.q) search.set('q', params.q)
        ;(params.niche || []).forEach((n) => search.append('niche', n))
        if (params.min_followers) search.set('min_followers', params.min_followers)
        if (params.max_followers) search.set('max_followers', params.max_followers)
        if (params.min_engagement)
          search.set('min_engagement', params.min_engagement)
        if (params.location) search.set('location', params.location)
        if (params.sort) search.set('sort', params.sort)
        return `/discovery/creators?${search.toString()}`
      }
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
  useCreateShortlistMutation,
  useAddToShortlistMutation,
  useGetShortlistQuery
} = discoveryApi
