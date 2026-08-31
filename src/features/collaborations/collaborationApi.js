import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Collaboration endpoints on collaboration-service (:4000).
export const collaborationApi = createApi({
  reducerPath: 'collaborationApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.collaboration),
  tagTypes: ['Collaborations', 'Timeline'],
  endpoints: (builder) => ({
    myCollaborations: builder.query({
      query: () => '/collaborations/mine',
      providesTags: ['Collaborations'],
      // Reviews/submissions come from the other party in a separate session,
      // so this party's cache can't be invalidated by their mutation — refetch
      // whenever the board is revisited instead of trusting the local cache.
      refetchOnMountOrArgChange: true
    }),
    collaborationTimeline: builder.query({
      query: (collaborationId) => `/collaborations/${collaborationId}/timeline`,
      providesTags: (result, error, id) => [{ type: 'Timeline', id }]
    }),
    submitDeliverable: builder.mutation({
      query: ({ deliverableId, file_refs, note }) => ({
        url: `/deliverables/${deliverableId}/submit`,
        method: 'POST',
        body: { file_refs, note }
      }),
      invalidatesTags: ['Collaborations', 'Timeline']
    }),
    reviewDeliverable: builder.mutation({
      query: ({ deliverableId, decision, feedback }) => ({
        url: `/deliverables/${deliverableId}/review`,
        method: 'POST',
        body: { decision, feedback }
      }),
      invalidatesTags: ['Collaborations', 'Timeline']
    }),
    markLive: builder.mutation({
      query: (deliverableId) => ({
        url: `/deliverables/${deliverableId}/mark-live`,
        method: 'POST'
      }),
      invalidatesTags: ['Collaborations', 'Timeline']
    })
  })
})

export const {
  useMyCollaborationsQuery,
  useCollaborationTimelineQuery,
  useSubmitDeliverableMutation,
  useReviewDeliverableMutation,
  useMarkLiveMutation
} = collaborationApi
