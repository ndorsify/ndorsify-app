import { Link, useNavigate, useParams } from 'react-router-dom'

import './creatorProfile.css'
import AppNav from '../../components/common/AppNav'
import { Avatar } from '../../components/common/ds'
import { PAGE_ROUTES, buildPath } from '../../routes'
import { money } from '../../lib/format'
import { useGetCreatorQuery } from './discoveryApi'
import { useCreateConversationMutation } from '../messaging/messagingApi'
import {
  useGetCreatorProfileQuery,
  useGetCreatorRateCardQuery
} from '../profile/profileApi'
import { summarizeItems } from '../profile/helpers'

const compact = (n) => {
  const v = Number(n)
  if (!v) return '—'
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`
  if (v >= 1000) return `${Math.round(v / 1000)}K`
  return `${v}`
}

function EmptyState({ children }) {
  return (
    <div
      className="nd-muted"
      style={{
        fontSize: '0.82rem',
        padding: '18px 4px',
        lineHeight: 1.55
      }}
    >
      {children}
    </div>
  )
}

export default function CreatorProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [createConversation, { isLoading: startingChat }] =
    useCreateConversationMutation()
  const {
    data: creator,
    isFetching,
    isError
  } = useGetCreatorQuery(id, { skip: !id })
  // profile-service adds bio/languages for creators who've completed a profile;
  // seeded catalog creators have no profile row, so tolerate its 404.
  const { data: profile } = useGetCreatorProfileQuery(id, { skip: !id })
  // Public read: visible packages only, and an empty list when the creator has
  // hidden their card.
  const { data: rateCard, isFetching: rateCardFetching } =
    useGetCreatorRateCardQuery(id, { skip: !id })
  const packages = (rateCard || {}).packages || []

  if (isFetching && !creator) {
    return (
      <>
        <AppNav />
        <div className="nd-page">
          <p className="nd-muted">Loading creator…</p>
        </div>
      </>
    )
  }

  if (isError || !creator) {
    return (
      <>
        <AppNav />
        <div className="nd-page nd-stack" style={{ gap: 14 }}>
          <h1 className="nd-h1">Creator not found</h1>
          <p className="nd-muted">This creator isn’t in the discovery index.</p>
          <Link
            to={PAGE_ROUTES.DISCOVER}
            className="nd-btn nd-btn--primary nd-btn--sm"
            style={{ alignSelf: 'flex-start' }}
          >
            ← Back to discovery
          </Link>
        </div>
      </>
    )
  }

  const name = creator.display_name || `Creator #${creator.user_id}`
  const initials = name.slice(0, 2).toUpperCase()
  const handle = creator.handle ? `@${creator.handle}` : `#${creator.user_id}`
  const niche = (creator.niches || [])[0] || 'Creator'
  const platform = (creator.platforms || [])[0]
  const location = creator.location || '—'
  const bio =
    profile?.bio ||
    `${niche} creator${platform ? ` on ${platform}` : ''}.${
      (creator.platforms || []).length > 1
        ? ` Also on ${creator.platforms.slice(1).join(', ')}.`
        : ''
    }`

  const stats = [
    { value: compact(creator.follower_count), label: 'Followers' },
    {
      value: creator.engagement_rate ? `${creator.engagement_rate}%` : '—',
      label: 'Engagement'
    },
    {
      value: creator.avg_rating ? `${creator.avg_rating}★` : '—',
      label: 'Brand rating'
    },
    {
      value: creator.rate_per_post ? money(creator.rate_per_post) : '—',
      label: 'From / post'
    }
  ]

  const onMessage = async () => {
    try {
      const conv = await createConversation(creator.user_id).unwrap()
      navigate(buildPath(PAGE_ROUTES.MESSAGE_THREAD, { id: conv.id }))
    } catch {
      /* e.g. messaging yourself, or offline — no-op */
    }
  }

  return (
    <>
      <AppNav />
      <div className="nd-page nd-page--flush">
        <div className="cp__crumb">
          <Link
            to={PAGE_ROUTES.DISCOVER}
            className="nd-btn nd-btn--ghost nd-btn--sm"
          >
            ← Back to discovery
          </Link>
          <span className="nd-eyebrow">
            Discover / {niche} / {name}
          </span>
        </div>

        <div className="cp">
          <div className="nd-stack">
            {/* Header */}
            <div className="nd-card" style={{ padding: 24 }}>
              <div
                className="nd-row"
                style={{ alignItems: 'flex-start', gap: 18 }}
              >
                <Avatar label={initials} size={84} />
                <div className="nd-grow nd-stack" style={{ gap: 8 }}>
                  <div className="nd-row nd-wrap" style={{ gap: 10 }}>
                    <h1 className="nd-h1" style={{ fontSize: '1.75rem' }}>
                      {name}
                    </h1>
                    {creator.verified && (
                      <span className="nd-pill nd-pill--success">
                        ✓ ID verified
                      </span>
                    )}
                    {creator.engagement_rate >= 6 && (
                      <span className="nd-pill nd-pill--accent">
                        High engagement
                      </span>
                    )}
                  </div>
                  <div className="nd-ink2" style={{ fontSize: '0.88rem' }}>
                    {handle} · {niche} · {location}
                  </div>
                  <div
                    className="nd-ink2"
                    style={{
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      maxWidth: 620
                    }}
                  >
                    {bio}
                  </div>
                </div>
              </div>
              <div className="cp__stats">
                {stats.map((s) => (
                  <div className="cp__stat" key={s.label}>
                    <div
                      className="nd-mono"
                      style={{ fontSize: '1.15rem', fontWeight: 500 }}
                    >
                      {s.value}
                    </div>
                    <div className="nd-muted" style={{ fontSize: '0.7rem' }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="nd-card" style={{ padding: 24 }}>
              <div className="nd-card-head">
                <div className="nd-h2">Portfolio</div>
              </div>
              <EmptyState>
                {name.split(' ')[0]} hasn’t added portfolio pieces yet. Media
                kits arrive once creators connect their platforms.
              </EmptyState>
            </div>

            {/* Past campaigns */}
            <div className="nd-card" style={{ padding: 24 }}>
              <div className="nd-h2" style={{ marginBottom: 4 }}>
                Past campaigns
              </div>
              <EmptyState>
                No completed Ndorsify campaigns yet — you’d be among the first
                to work with {name.split(' ')[0]}.
              </EmptyState>
            </div>
          </div>

          {/* Right rail */}
          <div className="nd-stack">
            <div className="nd-card nd-card--raise">
              <div className="nd-card-head">
                <div className="nd-h2">Rate card</div>
                <span
                  className="nd-mono nd-muted"
                  style={{ fontSize: '0.7rem' }}
                >
                  USD
                </span>
              </div>
              {rateCardFetching && !rateCard ? (
                <p className="nd-muted">Loading rate card…</p>
              ) : packages.length ? (
                <div className="nd-stack" style={{ gap: 12 }}>
                  {packages.map((pk, i) => (
                    <div className="cp__pkg" key={i}>
                      <div className="nd-between">
                        <span className="nd-h3" style={{ fontSize: '0.85rem' }}>
                          {pk.name}
                        </span>
                        <span
                          className="nd-mono"
                          style={{ fontSize: '1rem', fontWeight: 500 }}
                        >
                          {money(pk.price)}
                        </span>
                      </div>
                      <div
                        className="nd-ink2"
                        style={{ fontSize: '0.75rem', lineHeight: 1.55 }}
                      >
                        {summarizeItems(pk.items)}
                        {pk.description ? ` · ${pk.description}` : ''}
                      </div>
                      <div
                        className="nd-mono nd-muted"
                        style={{ fontSize: '0.68rem' }}
                      >
                        {pk.turnaround_days}-day turnaround
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState>Rate card not published yet.</EmptyState>
              )}
              <div className="nd-stack" style={{ gap: 10, marginTop: 14 }}>
                <Link
                  to={PAGE_ROUTES.CAMPAIGN_NEW}
                  className="nd-btn nd-btn--primary nd-btn--block"
                >
                  Invite to campaign
                </Link>
                <button
                  className="nd-btn nd-btn--secondary nd-btn--block"
                  onClick={onMessage}
                  disabled={startingChat}
                >
                  {startingChat ? 'Opening…' : `Message ${name.split(' ')[0]}`}
                </button>
              </div>
            </div>

            <div className="nd-card">
              <div className="nd-h2" style={{ marginBottom: 4 }}>
                Audience
              </div>
              <EmptyState>
                Audience demographics appear once {name.split(' ')[0]} connects
                a platform via the Ndorsify API.
              </EmptyState>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
