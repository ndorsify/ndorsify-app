import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Collaboration endpoints on collaboration-service (:4000).
export const collaborationApi = createApi({
  reducerPath: 'collaborationApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.collaboration),
  tagTypes: ['Collaborations'],
  endpoints: (builder) => ({
    myCollaborations: builder.query({
      query: () => '/collaborations/mine',
      providesTags: ['Collaborations'],
      // Reviews/submissions come from the other party in a separate session,
      // so this party's cache can't be invalidated by their mutation — refetch
      // whenever the board is revisited instead of trusting the local cache.
      refetchOnMountOrArgChange: true
    }),
    submitDeliverable: builder.mutation({
      query: ({ deliverableId, file_refs, note }) => ({
        url: `/deliverables/${deliverableId}/submit`,
        method: 'POST',
        body: { file_refs, note }
      }),
      invalidatesTags: ['Collaborations']
    }),
    reviewDeliverable: builder.mutation({
      query: ({ deliverableId, decision, feedback }) => ({
        url: `/deliverables/${deliverableId}/review`,
        method: 'POST',
        body: { decision, feedback }
      }),
      invalidatesTags: ['Collaborations']
    }),
    markLive: builder.mutation({
      query: (deliverableId) => ({
        url: `/deliverables/${deliverableId}/mark-live`,
        method: 'POST'
      }),
      invalidatesTags: ['Collaborations']
    })
  })
})

export const {
  useMyCollaborationsQuery,
  useSubmitDeliverableMutation,
  useReviewDeliverableMutation,
  useMarkLiveMutation
} = collaborationApi
