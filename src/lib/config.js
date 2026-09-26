// Where the API lives.
//
// In production the seven services sit behind one origin — Vercel routes
// /api/<service>/* to each of them — so the browser makes same-origin calls
// and CORS never enters the picture. Set REACT_APP_API_BASE (usually just
// "/api") and every service is derived from it.
//
// Locally they're still seven processes on seven ports, so with no base each
// entry falls back to its own URL (start.sh supplies the remapped ports).
const env = import.meta.env
const base = (env.REACT_APP_API_BASE || '').replace(/\/$/, '')

// The prefix each service answers on behind the shared origin. These have to
// match the rewrites in the backend's vercel.json.
const at = (prefix, devUrl) => (base ? `${base}${prefix}` : devUrl)

export const SERVICE_URLS = {
  users: at('/users', env.REACT_APP_USERS_URL || 'http://localhost:1000'),
  profile: at('/profiles', env.REACT_APP_PROFILE_URL || 'http://localhost:6060'),
  messaging: at('/messaging', env.REACT_APP_MESSAGING_URL || 'http://localhost:3000'),
  discovery: at('/discovery', env.REACT_APP_DISCOVERY_URL || 'http://localhost:9000'),
  dynamicContent: at(
    '/content',
    env.REACT_APP_DYNAMIC_CONTENT_URL || 'http://localhost:5000'
  ),
  campaign: at('/campaigns', env.REACT_APP_CAMPAIGN_URL || 'http://localhost:2000'),
  collaboration: at(
    '/collab',
    env.REACT_APP_COLLABORATION_URL || 'http://localhost:4000'
  )
}
