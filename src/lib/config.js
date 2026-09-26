// Where the API lives.
//
// Deployed, the seven services sit behind one origin and are addressed by the
// paths their routers already serve, with /api in front — /api/auth/login,
// /api/campaigns, /api/discovery/creators. So every slice shares one base and
// nothing needs a per-service mapping: set REACT_APP_API_BASE (usually "/api")
// and the calls are same-origin, which means no CORS to configure.
//
// Locally they're still seven processes on seven ports, so with no base each
// entry falls back to its own URL (start.sh supplies the remapped ports).
const env = import.meta.env
const base = (env.REACT_APP_API_BASE || '').replace(/\/$/, '')

const at = (devUrl) => base || devUrl

export const SERVICE_URLS = {
  users: at(env.REACT_APP_USERS_URL || 'http://localhost:1000'),
  profile: at(env.REACT_APP_PROFILE_URL || 'http://localhost:6060'),
  messaging: at(env.REACT_APP_MESSAGING_URL || 'http://localhost:3000'),
  discovery: at(env.REACT_APP_DISCOVERY_URL || 'http://localhost:9000'),
  dynamicContent: at(env.REACT_APP_DYNAMIC_CONTENT_URL || 'http://localhost:5000'),
  campaign: at(env.REACT_APP_CAMPAIGN_URL || 'http://localhost:2000'),
  collaboration: at(env.REACT_APP_COLLABORATION_URL || 'http://localhost:4000')
}
