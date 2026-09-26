// Per-service base URLs. Until an API gateway lands, the SPA holds one base URL
// per service (see docs/plans/technical-specifications/ui-foundation.md §3).
// When the gateway arrives, collapse these to a single REACT_APP_API_URL.
const env = import.meta.env

export const SERVICE_URLS = {
  users: env.REACT_APP_USERS_URL || 'http://localhost:1000',
  profile: env.REACT_APP_PROFILE_URL || 'http://localhost:6060',
  messaging: env.REACT_APP_MESSAGING_URL || 'http://localhost:3000',
  discovery: env.REACT_APP_DISCOVERY_URL || 'http://localhost:9000',
  dynamicContent: env.REACT_APP_DYNAMIC_CONTENT_URL || 'http://localhost:5000',
  campaign: env.REACT_APP_CAMPAIGN_URL || 'http://localhost:2000',
  collaboration: env.REACT_APP_COLLABORATION_URL || 'http://localhost:4000'
}
