import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import './home.css'
import AppNav from '../../components/common/AppNav'
import {
  Avatar,
  ChartPlaceholder,
  Kpi,
  Meter,
  SampleBanner
} from '../../components/common/ds'
import { PAGE_ROUTES, buildPath } from '../../routes'
import { apiErrorMessage } from '../../lib/errors'
import { selectUser } from '../auth/authSlice'
import { useMeQuery } from '../auth/authApi'
import {
  useMyCampaignsQuery,
  useMyInvitationsQuery
} from '../campaigns/campaignApi'
import {
  brandActivity,
  brandCampaigns,
  brandKpis,
  creatorSchedule,
  creatorTiles,
  profileTodos,
  sampleInvites
} from '../../lib/sampleData'

const firstName = (user) => {
  const source = user?.display_name || user?.company_name || user?.email || ''
  const base = source.split('@')[0].split(/[.\s_]/)[0]
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : 'there'
}

const statusVariant = (state) =>
  state === 'live' || state === 'open'
    ? 'nd-pill--success'
    : state === 'review' || state === 'draft'
    ? 'nd-pill--warn'
    : 'nd-pill--outline'

/* ------------------------------------------------------------------ Brand */
function BrandDashboard({ name }) {
  const { data: live = [], isLoading } = useMyCampaignsQuery()

  const rows = live.length
    ? live.map((c) => ({
        name: c.title,
        window:
          c.starts_on && c.ends_on
            ? `${c.starts_on} – ${c.ends_on}`
            : 'Dates TBD',
        creators: '',
        spend: c.budget_amount
          ? `${c.budget_amount} ${c.budget_currency || ''}`
          : '—',
        pct: '0%',
        reach: '—',
        status: c.status,
        state: c.status
      }))
    : brandCampaigns
  const usingSample = live.length === 0

  return (
    <>
      <div
        className="nd-between"
        style={{ alignItems: 'flex-end', marginBottom: 4 }}
      >
        <div className="nd-stack" style={{ gap: 5 }}>
          <h1 className="hm-greet">Good morning, {name}</h1>
          <p className="nd-sub">
            6 active campaigns · 3 drafts need your review
          </p>
        </div>
        <div className="nd-seg">
          <button className="nd-seg__item">7d</button>
          <button className="nd-seg__item is-active">30d</button>
          <button className="nd-seg__item">Quarter</button>
        </div>
      </div>

      <div className="nd-kpis" style={{ margin: '18px 0' }}>
        {brandKpis.map((k) => (
          <Kpi key={k.label} {...k} trend={k.down ? 'down' : 'up'} />
        ))}
      </div>

      <div className="hm-split">
        <div className="nd-stack">
          <div className="nd-card">
            <div className="nd-card-head">
              <div className="nd-h2">Active campaigns</div>
              <Link
                to={PAGE_ROUTES.CAMPAIGNS}
                className="nd-btn nd-btn--ghost nd-btn--sm"
              >
                View all →
              </Link>
            </div>
            <div className="nd-thead hm-campaign-row">
              <div>Campaign</div>
              <div>Creators</div>
              <div>Budget used</div>
              <div>Reach</div>
              <div>Status</div>
            </div>
            {isLoading && <div className="nd-empty">Loading campaigns…</div>}
            {rows.map((c, i) => (
              <div className="nd-trow hm-campaign-row" key={i}>
                <div>
                  <div className="nd-h3">{c.name}</div>
                  <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
                    {c.window}
                  </div>
                </div>
                <div className="hm-avatars">
                  <Avatar label="" size={26} />
                  <Avatar label="" size={26} />
                  <span
                    className="nd-mono nd-ink2"
                    style={{ fontSize: '0.75rem', marginLeft: 2 }}
                  >
                    {c.creators}
                  </span>
                </div>
                <div className="nd-stack" style={{ gap: 5 }}>
                  <span
                    className="nd-mono nd-ink2"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {c.spend}
                  </span>
                  <Meter value={c.pct} />
                </div>
                <div className="nd-mono" style={{ fontSize: '0.82rem' }}>
                  {c.reach}
                </div>
                <div>
                  <span className={`nd-pill ${statusVariant(c.state)}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
            {usingSample && (
              <div style={{ marginTop: 14 }}>
                <SampleBanner>
                  Sample campaigns — create one to see live rows.
                </SampleBanner>
              </div>
            )}
          </div>

          <div className="nd-card">
            <div className="nd-card-head">
              <div className="nd-h2">Spend &amp; reach — last 30 days</div>
              <div className="nd-row" style={{ gap: 14, fontSize: '0.75rem' }}>
                <span className="nd-row" style={{ gap: 6 }}>
                  <i
                    className="lg-swatch"
                    style={{ background: 'var(--accent)' }}
                  />
                  Spend
                </span>
                <span className="nd-row" style={{ gap: 6 }}>
                  <i
                    className="lg-swatch"
                    style={{ background: 'var(--success)' }}
                  />
                  Reach
                </span>
              </div>
            </div>
            <ChartPlaceholder label="dual-axis area chart" height={132} />
          </div>
        </div>

        <div className="nd-stack">
          <div className="nd-card">
            <div className="nd-h2" style={{ marginBottom: 14 }}>
              Recent activity
            </div>
            <div className="nd-stack" style={{ gap: 14 }}>
              {brandActivity.map((a, i) => (
                <div className="hm-activity" key={i}>
                  <span
                    className="hm-activity__dot"
                    style={{ background: a.dot }}
                  />
                  <div className="nd-grow">
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                      {a.text}
                    </div>
                    <div
                      className="nd-mono nd-muted"
                      style={{ fontSize: '0.68rem' }}
                    >
                      {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="nd-card nd-card--dark nd-stack" style={{ gap: 10 }}>
            <div className="nd-h2" style={{ color: '#fff' }}>
              3 creators awaiting your reply
            </div>
            <div
              style={{
                fontSize: '0.82rem',
                lineHeight: 1.55,
                color: 'var(--ink-faint)'
              }}
            >
              Devin Marsh countered at $4,800. Two others sent drafts for
              approval.
            </div>
            <Link
              to={PAGE_ROUTES.MESSAGES}
              className="nd-btn nd-btn--primary nd-btn--block"
            >
              Open inbox
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- Creator */
function CreatorInbox({ name }) {
  const { data: live = [], isLoading } = useMyInvitationsQuery()

  const invites = live.length
    ? live.map((i) => ({
        id: i.id,
        logo: `#${i.campaign_id}`,
        brand: `Campaign #${i.campaign_id}`,
        fit: i.status,
        campaign: i.message || 'Brand invitation',
        deliverables: '',
        offer: '',
        vsRate: '',
        expiry: i.status === 'pending' ? 'Awaiting reply' : i.status,
        expiryWarn: false,
        usage: ''
      }))
    : sampleInvites.map((s, idx) => ({ ...s, id: idx + 1 }))
  const usingSample = live.length === 0

  return (
    <>
      <div
        className="nd-between"
        style={{ alignItems: 'flex-end', marginBottom: 4 }}
      >
        <div className="nd-stack" style={{ gap: 5 }}>
          <h1 className="hm-greet">
            {invites.length} brand invitations, {name}
          </h1>
          <p className="nd-sub">
            Two expire in under 48 hours · your reply time averages 4h
          </p>
        </div>
        <div className="nd-seg">
          <button className="nd-seg__item is-active">Invites</button>
          <button className="nd-seg__item">Open briefs</button>
          <button className="nd-seg__item">Saved</button>
        </div>
      </div>

      <div className="nd-kpis" style={{ margin: '18px 0' }}>
        {creatorTiles.map((k) => (
          <Kpi key={k.label} {...k} trend={k.up ? 'up' : 'flat'} />
        ))}
      </div>

      <div className="hm-split">
        <div className="nd-card">
          <div className="nd-card-head">
            <div className="nd-h2">Invitations</div>
            <span className="nd-btn nd-btn--ghost nd-btn--sm">
              Set auto-decline rules →
            </span>
          </div>
          {isLoading && <div className="nd-empty">Loading invitations…</div>}
          {invites.map((i) => (
            <div
              className={
                i.expiryWarn
                  ? 'hm-invite-row hm-invite-row--warn'
                  : 'hm-invite-row'
              }
              key={i.id}
            >
              <div
                className="nd-row"
                style={{ alignItems: 'flex-start', gap: 12 }}
              >
                <Avatar label={i.logo} size={38} square />
                <div className="nd-grow">
                  <div className="nd-row" style={{ gap: 7 }}>
                    <span className="nd-h3">{i.brand}</span>
                    {i.fit && (
                      <span className="nd-pill nd-pill--success">{i.fit}</span>
                    )}
                  </div>
                  <div className="nd-ink2" style={{ fontSize: '0.78rem' }}>
                    {i.campaign}
                  </div>
                  {i.deliverables && (
                    <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
                      {i.deliverables}
                    </div>
                  )}
                </div>
              </div>
              <div className="nd-stack" style={{ gap: 3 }}>
                {i.offer && (
                  <span
                    className="nd-mono"
                    style={{ fontSize: '0.95rem', fontWeight: 500 }}
                  >
                    {i.offer}
                  </span>
                )}
                {i.vsRate && (
                  <span className="nd-muted" style={{ fontSize: '0.68rem' }}>
                    {i.vsRate}
                  </span>
                )}
              </div>
              <div className="nd-stack" style={{ gap: 3 }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: i.expiryWarn ? 'var(--danger)' : 'var(--ink-2)'
                  }}
                >
                  {i.expiry}
                </span>
                {i.usage && (
                  <span className="nd-muted" style={{ fontSize: '0.68rem' }}>
                    {i.usage}
                  </span>
                )}
              </div>
              <div className="nd-row" style={{ gap: 8 }}>
                <Link
                  to={buildPath(PAGE_ROUTES.INVITATION_DETAIL, { id: i.id })}
                  className="nd-btn nd-btn--primary nd-btn--sm nd-grow"
                  style={{ justifyContent: 'center' }}
                >
                  Review offer
                </Link>
                <span className="nd-btn nd-btn--secondary nd-btn--sm">
                  Pass
                </span>
              </div>
            </div>
          ))}
          {usingSample && (
            <SampleBanner>
              Sample invitations — live invites appear here as brands reach out.
            </SampleBanner>
          )}
        </div>

        <div className="nd-stack">
          <div className="nd-card">
            <div className="nd-h2" style={{ marginBottom: 12 }}>
              Profile strength
            </div>
            <div
              className="nd-row"
              style={{ alignItems: 'baseline', gap: 8, marginBottom: 10 }}
            >
              <span
                className="nd-mono"
                style={{ fontSize: '1.6rem', fontWeight: 500 }}
              >
                82
              </span>
              <span className="nd-muted" style={{ fontSize: '0.75rem' }}>
                / 100 — top 12% in Beauty
              </span>
            </div>
            <Meter value={82} style={{ height: 8, marginBottom: 14 }} />
            <div className="nd-stack" style={{ gap: 10 }}>
              {profileTodos.map((t) => (
                <div className="hm-todo" key={t.label}>
                  <span className={t.done ? 'hm-check is-done' : 'hm-check'}>
                    {t.done ? '✓' : ''}
                  </span>
                  <span className="nd-grow" style={{ fontSize: '0.78rem' }}>
                    {t.label}
                  </span>
                  <span
                    className="nd-mono nd-muted"
                    style={{ fontSize: '0.68rem' }}
                  >
                    {t.gain}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="nd-card">
            <div className="nd-h2" style={{ marginBottom: 12 }}>
              This week
            </div>
            <div className="nd-stack" style={{ gap: 12 }}>
              {creatorSchedule.map((s) => (
                <div className="hm-sched" key={s.task}>
                  <span className="hm-sched__day">{s.day}</span>
                  <div className="nd-grow">
                    <div className="nd-h3" style={{ fontSize: '0.82rem' }}>
                      {s.task}
                    </div>
                    <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
                      {s.brand}
                    </div>
                  </div>
                  <span
                    className={
                      s.warn
                        ? 'nd-pill nd-pill--warn'
                        : 'nd-pill nd-pill--accent'
                    }
                  >
                    {s.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function HomePage() {
  const cachedUser = useSelector(selectUser)
  const { data, isError, error } = useMeQuery()
  const user = data || cachedUser
  const isBrand = user?.role === 'brand'
  const name = firstName(user)

  return (
    <>
      <AppNav />
      <div className="nd-page">
        {isError && (
          <p className="nd-error" style={{ marginBottom: 12 }}>
            Couldn't refresh your account ({apiErrorMessage(error)})
            {cachedUser ? ' — showing your last known details.' : '.'}
          </p>
        )}
        {isBrand ? (
          <BrandDashboard name={name} />
        ) : (
          <CreatorInbox name={name} />
        )}
      </div>
    </>
  )
}
