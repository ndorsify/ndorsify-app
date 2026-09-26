// API and page route constants.
const API_ROUTES = {
  API_NAME: '/'
}

const PAGE_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  OAUTH_CALLBACK: '/oauth/callback',
  ONBOARDING: '/onboarding',
  PROFILE_EDIT: '/profile/edit',
  SETTINGS: '/settings',
  DISCOVER: '/discover',
  CREATOR_PROFILE: '/creators/:id',
  MESSAGES: '/messages',
  MESSAGE_THREAD: '/messages/:id',
  CAMPAIGNS: '/campaigns',
  CAMPAIGN_NEW: '/campaigns/new',
  CAMPAIGN_FUND: '/campaigns/:id/fund',
  CAMPAIGN_REPORT: '/campaigns/:id/report',
  MARKETPLACE: '/marketplace',
  INVITATIONS: '/invitations',
  INVITATION_DETAIL: '/invitations/:id',
  CONTRACT: '/deals/:id/contract',
  DRAFT_REVIEW: '/deals/:id/review',
  EARNINGS: '/earnings',
  COLLABORATIONS: '/collaborations-board',
  SOCIAL_CALLBACK: '/social/:platform/callback'
}

// Build a concrete path from a `:param` template.
const buildPath = (template, params = {}) =>
  Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(value)),
    template
  )

export { API_ROUTES, PAGE_ROUTES, buildPath }
