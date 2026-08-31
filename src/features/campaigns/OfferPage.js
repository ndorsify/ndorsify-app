import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './offer.css'
import AppNav from '../../components/common/AppNav'
import { Avatar } from '../../components/common/ds'
import { PAGE_ROUTES } from '../../routes'
import { useRespondInvitationMutation } from './campaignApi'
import { brandTrust, offerLines } from '../../lib/sampleData'

const COUNTER_MODS = [
  { label: 'Add script pass +$400', on: true },
  { label: 'Drop 1 Story −$150', on: false },
  { label: 'Paid ads 30d +$800', on: false }
]

export default function OfferPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [respond, { isLoading }] = useRespondInvitationMutation()
  const [note, setNote] = useState(
    'The ingredient angle works for my audience — the Story set needs its own script pass, which I price separately.'
  )

  const decide = async (decision) => {
    try {
      await respond({ invitationId: Number(id), decision }).unwrap()
    } catch {
      /* demo mode / offline — proceed to inbox regardless */
    }
    navigate(PAGE_ROUTES.DASHBOARD)
  }

  return (
    <>
      <AppNav />
      <div className="of">
        <div className="of__bar">
          <div className="nd-row" style={{ gap: 14 }}>
            <button
              className="nd-btn nd-btn--ghost nd-btn--sm"
              onClick={() => navigate(-1)}
            >
              ← Opportunities
            </button>
            <span className="nd-eyebrow">
              Invite from Kettle &amp; Fern · expires in 41h
            </span>
          </div>
          <div className="nd-row" style={{ gap: 10 }}>
            <button
              className="nd-btn nd-btn--secondary nd-btn--sm"
              onClick={() => decide('declined')}
              disabled={isLoading}
            >
              Pass politely
            </button>
            <button
              className="nd-btn nd-btn--primary nd-btn--sm"
              onClick={() => decide('accepted')}
              disabled={isLoading}
            >
              Accept $2,800
            </button>
          </div>
        </div>

        <div className="of__body">
          <div className="nd-stack">
            {/* Brief */}
            <div className="nd-card" style={{ padding: 24 }}>
              <div
                className="nd-row"
                style={{ alignItems: 'flex-start', gap: 16, marginBottom: 18 }}
              >
                <Avatar label="K&F" size={56} square />
                <div className="nd-grow nd-stack" style={{ gap: 7 }}>
                  <h1 className="nd-h1" style={{ fontSize: '1.6rem' }}>
                    Spring Glow Launch
                  </h1>
                  <div className="nd-ink2" style={{ fontSize: '0.85rem' }}>
                    Kettle &amp; Fern · barrier-repair serum · Apr 6 – May 4
                  </div>
                  <div className="nd-row nd-wrap" style={{ gap: 8 }}>
                    <span className="nd-pill nd-pill--success">
                      94% audience fit
                    </span>
                    <span className="nd-pill nd-pill--accent">
                      Organic rights only
                    </span>
                    <span className="nd-pill nd-pill--outline">
                      Product seeded
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="nd-ink2"
                style={{
                  fontSize: '0.88rem',
                  lineHeight: 1.65,
                  maxWidth: 700,
                  marginBottom: 18
                }}
              >
                We're launching a ceramide barrier serum for humid climates and
                want honest, ingredient-first content. Your SPF test carousel is
                the tone we're after — no scripted claims, show the texture and
                the 2-week check-in.
              </div>
              <div className="of__guard">
                <div className="of__guard-box">
                  <span className="nd-eyebrow">Must include</span>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.55 }}>
                    Product visible in first 3s · #ad disclosure · swipe-up to
                    product page
                  </div>
                </div>
                <div className="of__guard-box of__guard-box--warn">
                  <span
                    className="nd-eyebrow"
                    style={{ color: 'var(--warn-ink)' }}
                  >
                    Do not say
                  </span>
                  <div style={{ fontSize: '0.8rem', lineHeight: 1.55 }}>
                    “Cures eczema” · “dermatologist approved” · competitor names
                  </div>
                </div>
              </div>
            </div>

            {/* Asking for */}
            <div className="nd-card" style={{ padding: 24 }}>
              <div className="nd-card-head">
                <div className="nd-h2">What they're asking for</div>
                <span
                  className="nd-mono nd-muted"
                  style={{ fontSize: '0.68rem' }}
                >
                  vs. your rate card
                </span>
              </div>
              {offerLines.map((o) => (
                <div className="nd-trow of__line" key={o.type}>
                  <div>
                    <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
                      {o.type}
                    </div>
                    <div className="nd-muted" style={{ fontSize: '0.7rem' }}>
                      {o.spec}
                    </div>
                  </div>
                  <div
                    className="nd-mono nd-ink2"
                    style={{ fontSize: '0.8rem' }}
                  >
                    × {o.qty}
                  </div>
                  <div
                    className="nd-mono nd-muted"
                    style={{ fontSize: '0.8rem' }}
                  >
                    {o.yours}
                  </div>
                  <div
                    className="nd-mono"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: o.under ? 'var(--warn-ink)' : 'var(--ink)'
                    }}
                  >
                    {o.offered}
                  </div>
                </div>
              ))}
              <div
                className="nd-between"
                style={{ alignItems: 'baseline', paddingTop: 10 }}
              >
                <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
                  Offered total
                </div>
                <div
                  className="nd-row"
                  style={{ alignItems: 'baseline', gap: 12 }}
                >
                  <span
                    className="nd-mono nd-muted"
                    style={{ fontSize: '0.8rem' }}
                  >
                    rate card $3,200
                  </span>
                  <span
                    className="nd-mono"
                    style={{ fontSize: '1.35rem', fontWeight: 500 }}
                  >
                    $2,800
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="nd-stack">
            <div
              className="nd-card nd-card--accent nd-stack"
              style={{ gap: 14 }}
            >
              <div className="nd-h2">Counter-offer</div>
              <div className="nd-stack" style={{ gap: 7 }}>
                <span className="nd-eyebrow">Your price</span>
                <div className="of__price">
                  <span
                    className="nd-mono"
                    style={{ fontSize: '1.25rem', fontWeight: 500 }}
                  >
                    $3,200
                  </span>
                  <span className="nd-muted" style={{ fontSize: '0.75rem' }}>
                    +14% vs. offer
                  </span>
                </div>
              </div>
              <div className="nd-row nd-wrap" style={{ gap: 8 }}>
                {COUNTER_MODS.map((m) => (
                  <span
                    key={m.label}
                    className={m.on ? 'of__mod is-on' : 'of__mod'}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
              <textarea
                className="nd-textarea"
                style={{ minHeight: 78, fontSize: '0.8rem' }}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button className="nd-btn nd-btn--primary nd-btn--block">
                Send counter-offer
              </button>
              <div
                className="nd-muted"
                style={{ fontSize: '0.72rem', textAlign: 'center' }}
              >
                Brands accept counters from you 68% of the time
              </div>
            </div>

            <div className="nd-card nd-stack" style={{ gap: 12 }}>
              <div className="nd-h2">About this brand</div>
              {brandTrust.map((b) => (
                <div
                  className="nd-between"
                  style={{ fontSize: '0.8rem', color: 'var(--ink-2)' }}
                  key={b.label}
                >
                  <span>{b.label}</span>
                  <span className="nd-mono" style={{ color: 'var(--ink)' }}>
                    {b.value}
                  </span>
                </div>
              ))}
              <div className="of__escrow">
                Budget already in escrow — payout 48h after your final post goes
                live.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
