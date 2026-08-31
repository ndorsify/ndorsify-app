import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Campaign endpoints on campaign-service (:2000).
export const campaignApi = createApi({
  reducerPath: 'campaignApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.campaign),
  tagTypes: ['MyCampaigns', 'Campaign', 'Applications', 'Invitations'],
  endpoints: (builder) => ({
    // Brand
    createCampaign: builder.mutation({
      query: (body) => ({ url: '/campaigns', method: 'POST', body }),
      invalidatesTags: ['MyCampaigns']
    }),
    myCampaigns: builder.query({
      query: () => '/campaigns/mine',
      providesTags: ['MyCampaigns']
    }),
    getCampaign: builder.query({
      query: (id) => `/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: 'Campaign', id }]
    }),
    publishCampaign: builder.mutation({
      query: (id) => ({ url: `/campaigns/${id}/publish`, method: 'POST' }),
      invalidatesTags: ['MyCampaigns', 'Campaign']
    }),
    closeCampaign: builder.mutation({
      query: (id) => ({ url: `/campaigns/${id}/close`, method: 'POST' }),
      invalidatesTags: ['MyCampaigns', 'Campaign']
    }),
    fundCampaign: builder.mutation({
      query: (id) => ({ url: `/campaigns/${id}/fund`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Campaign', id },
        'MyCampaigns'
      ]
    }),
    invite: builder.mutation({
      query: ({ campaignId, creatorId, message }) => ({
        url: `/campaigns/${campaignId}/invitations`,
        method: 'POST',
        body: { creator_id: creatorId, message }
      })
    }),
    listApplications: builder.query({
      query: (campaignId) => `/campaigns/${campaignId}/applications`,
      providesTags: ['Applications']
    }),
    decideApplication: builder.mutation({
      query: ({ applicationId, decision }) => ({
        url: `/applications/${applicationId}/decide`,
        method: 'POST',
        body: { decision }
      }),
      invalidatesTags: ['Applications']
    }),
    // Creator
    marketplace: builder.query({
      query: (params = {}) => {
        const s = new URLSearchParams()
        if (params.q) s.set('q', params.q)
        if (params.min_budget) s.set('min_budget', params.min_budget)
        return `/campaigns?${s.toString()}`
      }
    }),
    apply: builder.mutation({
      query: ({ campaignId, proposal, proposed_rate }) => ({
        url: `/campaigns/${campaignId}/applications`,
        method: 'POST',
        body: { proposal, proposed_rate }
      })
    }),
    myInvitations: builder.query({
      query: () => '/invitations/mine',
      providesTags: ['Invitations']
    }),
    respondInvitation: builder.mutation({
      query: ({ invitationId, decision }) => ({
        url: `/invitations/${invitationId}/respond`,
        method: 'POST',
        body: { decision }
      }),
      invalidatesTags: ['Invitations']
    })
  })
})

export const {
  useCreateCampaignMutation,
  useMyCampaignsQuery,
  useGetCampaignQuery,
  usePublishCampaignMutation,
  useCloseCampaignMutation,
  useFundCampaignMutation,
  useInviteMutation,
  useListApplicationsQuery,
  useDecideApplicationMutation,
  useMarketplaceQuery,
  useLazyMarketplaceQuery,
  useApplyMutation,
  useMyInvitationsQuery,
  useRespondInvitationMutation
} = campaignApi
