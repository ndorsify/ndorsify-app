import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Media storage on dynamic-content-service (:5000). Bytes never go through
// these calls — they only mint the short-lived signed URLs the browser then
// PUTs to / GETs from directly (see the service's app/services/media.py).
export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.dynamicContent),
  endpoints: (builder) => ({
    signUpload: builder.mutation({
      query: ({ scope, refId, contentType, sizeBytes }) => ({
        url: '/media/sign-upload',
        method: 'POST',
        body: {
          scope,
          ref_id: refId == null ? null : String(refId),
          content_type: contentType,
          size_bytes: sizeBytes
        }
      })
    }),
    // A mutation, not a query: the URL it returns expires, so it must be
    // fetched on demand rather than cached against the key.
    signDownload: builder.mutation({
      query: (key) => ({ url: '/media/sign-download', params: { key } })
    })
  })
})

export const { useSignUploadMutation, useSignDownloadMutation } = mediaApi
