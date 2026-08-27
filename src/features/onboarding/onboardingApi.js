import { createApi } from '@reduxjs/toolkit/query/react'

import { makeBaseQueryWithReauth } from '../../lib/baseQuery'
import { SERVICE_URLS } from '../../lib/config'

// Onboarding content on dynamic-content-service (:5000).
export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: makeBaseQueryWithReauth(SERVICE_URLS.dynamicContent),
  endpoints: (builder) => ({
    // Returns { status, message, data: { category: [{question, dataType, options}] } }
    getCreatorQuestions: builder.query({
      query: () => '/onboard/creator/questions',
      transformResponse: (res) => res.data || {}
    })
  })
})

export const { useGetCreatorQuestionsQuery } = onboardingApi
