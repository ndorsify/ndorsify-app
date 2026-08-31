import { Link, useNavigate } from 'react-router-dom'

import './landing.css'
import { PAGE_ROUTES } from '../../routes'
import { Avatar, ChartPlaceholder } from '../../components/common/ds'
import {
  footerCols,
  heroMatches,
  landingFeatures,
  landingLogos,
  landingStats
} from '../../lib/sampleData'

export default function LandingPage() {
  const navigate = useNavigate()
  const start = (role) => navigate(PAGE_ROUTES.REGISTER, { state: { role } })

  return (
    <div className="lp">
      <div className="lp__frame">
        {/* Top nav */}
        <header className="lp__nav">
          <div className="nd-row" style={{ gap: 36 }}>
            <span className="nd-brand" style={{ pointerEvents: 'none' }}>
              <span className="nd-brand__mark" />
              <span className="nd-brand__word">Ndorsify</span>
            </span>
            <nav className="lp__navlinks">
              <span>For brands</span>
              <span>For creators</span>
              <span>Pricing</span>
              <span>Case studies</span>
            </nav>
          </div>
          <div className="nd-row" style={{ gap: 12 }}>
            <Link to={PAGE_ROUTES.LOGIN} className="lp__login">
              Log in
            </Link>
            <button className="nd-btn nd-btn--primary" onClick={() => start()}>
              Get started
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="lp__hero">
          <div className="lp__hero-copy">
            <span className="nd-pill nd-pill--accent">
              12,480 vetted creators across 9 platforms
            </span>
            <h1 className="nd-display">
              Connect brands with the right creators
            </h1>
            <p className="lp__lede">
              Search real audience data, agree on rates in the open, and run the
              whole endorsement — brief to payout — in one place.
            </p>
            <div className="lp__roles">
              <button
                className="lp__role lp__role--brand"
                onClick={() => start('brand')}
              >
                <span className="lp__role-title">I'm a Brand</span>
                <span className="lp__role-sub">Find and book creators</span>
              </button>
              <button
                className="lp__role lp__role--creator"
                onClick={() => start('creator')}
              >
                <span className="lp__role-title">I'm a Creator</span>
                <span className="lp__role-sub">Get paid brand deals</span>
              </button>
            </div>
            <div className="lp__reassure">
              <span>
                <span className="nd-dot" /> No platform fee for creators
              </span>
              <span>
                <span className="nd-dot" /> Escrow-backed payments
              </span>
            </div>
          </div>

          <div className="lp__hero-visual">
            <div
              className="nd-card nd-card--raise"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div className="nd-between">
                <span className="nd-eyebrow">Matches for “clean skincare”</span>
                <span className="nd-pill nd-pill--success">94% fit</span>
              </div>
              {heroMatches.map((c) => (
                <div key={c.name} className="lp__match">
                  <Avatar label={c.initials} size={44} />
                  <div className="nd-grow">
                    <div className="nd-h3">{c.name}</div>
                    <div className="nd-sub">
                      {c.niche} · {c.followers} followers
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="nd-mono" style={{ fontWeight: 500 }}>
                      {c.engagement}
                    </div>
                    <div className="nd-sub">engagement</div>
                  </div>
                </div>
              ))}
              <div className="nd-btn nd-btn--dark nd-btn--block">
                Invite all 3 to campaign
              </div>
            </div>
            <ChartPlaceholder label="campaign performance chart" height={140} />
          </div>
        </section>

        {/* Logo strip */}
        <section className="lp__logos">
          <span className="nd-eyebrow" style={{ whiteSpace: 'nowrap' }}>
            Trusted by 2,300+ brands
          </span>
          <div className="lp__logo-row">
            {landingLogos.map((l) => (
              <div className="lp__logo" key={l}>
                {l}
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="lp__stats">
          {landingStats.map((s) => (
            <div className="lp__stat" key={s.label}>
              <div className="lp__stat-val">{s.value}</div>
              <div className="nd-ink2" style={{ fontSize: '0.82rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="lp__how">
          <div className="nd-between" style={{ alignItems: 'flex-end' }}>
            <div className="nd-stack" style={{ gap: 10, maxWidth: 560 }}>
              <span className="nd-eyebrow">How it works</span>
              <h2 className="lp__how-title">
                Everything an endorsement needs, minus the email chains
              </h2>
            </div>
            <span className="nd-btn nd-btn--ghost">
              See a sample campaign →
            </span>
          </div>
          <div className="lp__features">
            {landingFeatures.map((f) => (
              <div
                className="nd-card"
                key={f.num}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <span className="lp__feat-num">{f.num}</span>
                <div className="nd-h2" style={{ fontSize: '1.18rem' }}>
                  {f.title}
                </div>
                <div
                  className="nd-ink2"
                  style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
                >
                  {f.body}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial + CTA */}
        <section className="lp__cta">
          <div className="lp__quote">
            <div className="lp__quote-text">
              “We booked 14 creators for a product launch in nine days. The rate
              transparency alone saved my team a month of back-and-forth.”
            </div>
            <div className="nd-row">
              <Avatar label="RO" size={40} />
              <div>
                <div className="nd-h3">Rachel Oyelaran</div>
                <div className="nd-muted" style={{ fontSize: '0.82rem' }}>
                  Head of Growth, Kettle &amp; Fern
                </div>
              </div>
            </div>
          </div>
          <div className="lp__cta-actions">
            <button
              className="nd-btn nd-btn--primary nd-btn--lg nd-btn--block"
              onClick={() => start('brand')}
            >
              Post your first campaign — free
            </button>
            <div className="lp__cta-secondary">Talk to sales</div>
            <div
              className="nd-muted"
              style={{ fontSize: '0.75rem', textAlign: 'center' }}
            >
              No card required · Cancel anytime
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="lp__footer">
          <div className="nd-stack" style={{ gap: 12 }}>
            <span className="nd-brand" style={{ pointerEvents: 'none' }}>
              <span className="nd-brand__mark" />
              <span className="nd-brand__word">Ndorsify</span>
            </span>
            <div
              className="nd-muted"
              style={{ fontSize: '0.82rem', maxWidth: 280 }}
            >
              The marketplace for brand endorsements. Built in Austin, TX.
            </div>
          </div>
          {footerCols.map((col) => (
            <div className="nd-stack" style={{ gap: 10 }} key={col.title}>
              <span className="nd-eyebrow">{col.title}</span>
              {col.links.map((lk) => (
                <span
                  className="nd-ink2"
                  style={{ fontSize: '0.82rem' }}
                  key={lk}
                >
                  {lk}
                </span>
              ))}
            </div>
          ))}
        </footer>
        <div className="lp__legal">
          <span>© 2026 Ndorsify, Inc.</span>
          <span className="nd-row" style={{ gap: 20 }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Creator agreement</span>
          </span>
        </div>
      </div>
    </div>
  )
}
