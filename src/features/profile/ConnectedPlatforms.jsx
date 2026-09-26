import { apiErrorMessage } from '../../lib/errors'
import { formatFollowers, formatSyncedAt } from './helpers'
import {
  useDisconnectSocialAccountMutation,
  useListMySocialAccountsQuery,
  useStartSocialConnectMutation,
  useSyncSocialAccountMutation
} from './profileApi'

// Mirrors VALID_PLATFORMS in profile-service (services/social.py). Anything
// outside this set is rejected there with a 400, so the panel never offers one.
const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', tag: 'IG' },
  { id: 'tiktok', name: 'TikTok', tag: 'TT' },
  { id: 'youtube', name: 'YouTube', tag: 'YT' },
  { id: 'twitter', name: 'X', tag: 'X' }
]

function PlatformRow({
  platform,
  account,
  busy,
  onConnect,
  onSync,
  onDisconnect
}) {
  const connected = Boolean(account)

  return (
    <div className="pe__platform">
      <span className="pe__ptag">{platform.tag}</span>

      <div className="nd-grow">
        <div className="nd-h3" style={{ fontSize: '0.82rem' }}>
          {platform.name}
        </div>
        {connected ? (
          <>
            <div className="nd-muted" style={{ fontSize: '0.7rem' }}>
              {account.handle || '—'}
            </div>
            <div className="nd-muted" style={{ fontSize: '0.7rem' }}>
              {formatFollowers(account.follower_count)} followers ·{' '}
              {Number(account.engagement_rate).toFixed(1)}% engagement
            </div>
            <div className="nd-muted" style={{ fontSize: '0.65rem' }}>
              Synced {formatSyncedAt(account.last_synced_at)}
            </div>
          </>
        ) : (
          <div className="nd-muted" style={{ fontSize: '0.7rem' }}>
            Not connected
          </div>
        )}
      </div>

      {connected ? (
        <div className="nd-row" style={{ gap: 6 }}>
          <button
            className="nd-btn nd-btn--sm"
            disabled={busy}
            onClick={() => onSync(platform.id)}
            type="button"
          >
            Sync
          </button>
          <button
            className="nd-btn nd-btn--sm"
            disabled={busy}
            onClick={() => onDisconnect(platform.id)}
            type="button"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="nd-btn nd-btn--primary nd-btn--sm"
          disabled={busy}
          onClick={() => onConnect(platform.id)}
          type="button"
        >
          Connect
        </button>
      )}
    </div>
  )
}

/**
 * Live connected-social-accounts panel. No sample fallback: a creator with
 * nothing connected sees an honest empty state rather than plausible-looking
 * numbers they never entered.
 */
export default function ConnectedPlatforms() {
  const {
    data: accounts = [],
    isLoading,
    error
  } = useListMySocialAccountsQuery()
  const [startConnect, { isLoading: connecting }] =
    useStartSocialConnectMutation()
  const [syncAccount, { isLoading: syncing }] = useSyncSocialAccountMutation()
  const [disconnect, { isLoading: disconnecting }] =
    useDisconnectSocialAccountMutation()

  const busy = connecting || syncing || disconnecting
  const byPlatform = Object.fromEntries(accounts.map((a) => [a.platform, a]))

  // Hand the browser to the provider's consent screen. It returns to
  // SocialCallbackPage, so this navigation is deliberately a full page leave.
  const handleConnect = async (platform) => {
    try {
      const { connect_url: connectUrl } = await startConnect(platform).unwrap()
      window.location.href = connectUrl
    } catch {
      // Surfaced by the mutation's own error state below.
    }
  }

  return (
    <>
      <div className="nd-h1" style={{ fontSize: '1.25rem' }}>
        Connected platforms
      </div>

      {isLoading && <p className="nd-muted">Loading…</p>}
      {error && <p className="nd-error">{apiErrorMessage(error)}</p>}

      {!isLoading && accounts.length === 0 && (
        <p className="nd-muted" style={{ fontSize: '0.72rem' }}>
          Connect a platform to pull in real follower and engagement numbers.
          Until then, brands searching Discover won&apos;t see your stats.
        </p>
      )}

      {PLATFORMS.map((platform) => (
        <PlatformRow
          account={byPlatform[platform.id]}
          busy={busy}
          key={platform.id}
          onConnect={handleConnect}
          onDisconnect={disconnect}
          onSync={syncAccount}
          platform={platform}
        />
      ))}
    </>
  )
}
