import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Messaging endpoints on messaging-service (:3000).
export const messagingApi = createApi({
  reducerPath: 'messagingApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.messaging),
  tagTypes: ['Conversations', 'Messages'],
  endpoints: (builder) => ({
    listConversations: builder.query({
      query: () => '/conversations',
      providesTags: ['Conversations']
    }),
    createConversation: builder.mutation({
      query: (recipientId) => ({
        url: '/conversations',
        method: 'POST',
        body: { recipient_id: recipientId }
      }),
      invalidatesTags: ['Conversations']
    }),
    getMessages: builder.query({
      query: (conversationId) => `/conversations/${conversationId}/messages`,
      providesTags: (result, error, id) => [{ type: 'Messages', id }]
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, body }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: 'POST',
        body: { body }
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        'Conversations'
      ]
    }),
    markRead: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/read`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Messages', id }]
    })
  })
})

export const {
  useListConversationsQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkReadMutation
} = messagingApi
