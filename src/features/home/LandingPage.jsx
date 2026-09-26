import { Link, useNavigate } from 'react-router-dom'

import './landing.css'
import { PAGE_ROUTES } from '../../routes'
import { Avatar } from '../../components/common/ds'
import {
  footerCols,
  landingFeatures,
  landingStats
} from '../../lib/sampleData'
import { brandLogos } from './brandLogos'

// Creators shown in the hero's Discover dashboard mockup.
const heroCreators = [
  {
    name: 'Maya Okonkwo',
    handle: '@mayamoves',
    initials: 'MO',
    grad: 'linear-gradient(135deg,#574fe0,#8f78ff)',
    platforms: ['Instagram', 'TikTok'],
    followers: '312k',
    engagement: '6.4%',
    rate: '$1,800'
  },
  {
    name: 'Jordan Reyes',
    handle: '@jordancooks',
    initials: 'JR',
    grad: 'linear-gradient(135deg,#10a08a,#4fd0b8)',
    platforms: ['YouTube', 'Instagram'],
    followers: '128k',
    engagement: '8.1%',
    rate: '$950'
  }
]

// Deliverable timeline shown in the floating collaboration card.
const heroTimeline = [
  { label: 'Accepted', state: 'done', icon: '✓', meta: 'Aug 28' },
  { label: 'Submitted', state: 'done', icon: '✓', meta: 'Sep 02' },
  { label: 'Approved', state: 'now', icon: '●', meta: 'today' },
  { label: 'Live', state: 'wait', icon: '○', meta: '—' }
]

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
            {/* Product window: the live Discover dashboard, mirrored from the
                nd-* design system. */}
            <div className="lp__win">
              <div className="lp__win-bar">
                <span className="lp__win-dot lp__win-dot--r" />
                <span className="lp__win-dot lp__win-dot--y" />
                <span className="lp__win-dot lp__win-dot--g" />
                <span className="lp__win-url">app.ndorsify.com/discover</span>
              </div>
              <div className="lp__win-app">
                <aside className="lp__win-side">
                  <span className="nd-brand" style={{ pointerEvents: 'none' }}>
                    <span className="nd-brand__mark" />
                    <span
                      className="nd-brand__word"
                      style={{ fontSize: '0.92rem' }}
                    >
                      Ndorsify
                    </span>
                  </span>
                  <nav className="lp__win-nav">
                    {[
                      'Home',
                      'Discover',
                      'Campaigns',
                      'Messages',
                      'Collaborations',
                      'Earnings'
                    ].map((item) => (
                      <span
                        key={item}
                        className={
                          'lp__win-navi' +
                          (item === 'Discover' ? ' is-active' : '')
                        }
                      >
                        <span className="lp__win-ic" />
                        {item}
                      </span>
                    ))}
                  </nav>
                </aside>
                <div className="lp__win-main">
                  <div className="lp__win-h">
                    <div>
                      <div className="lp__win-title">Discover creators</div>
                      <div className="lp__win-sub">
                        1,204 matches · sorted by engagement
                      </div>
                    </div>
                  </div>
                  <div className="lp__win-chips">
                    <span className="lp__win-chip is-on">Verified</span>
                    <span className="lp__win-chip">Instagram</span>
                    <span className="lp__win-chip">100k–500k</span>
                    <span className="lp__win-chip">Fitness</span>
                  </div>
                  <div className="lp__win-grid">
                    {heroCreators.map((c) => (
                      <div className="lp__cc" key={c.handle}>
                        <div className="lp__cc-top">
                          <span
                            className="lp__cc-av"
                            style={{ background: c.grad }}
                          >
                            {c.initials}
                          </span>
                          <div>
                            <div className="lp__cc-name">
                              {c.name}
                              <span className="lp__cc-verified">✓</span>
                            </div>
                            <div className="lp__cc-handle">{c.handle}</div>
                          </div>
                        </div>
                        <div className="lp__cc-plats">
                          {c.platforms.map((p) => (
                            <span className="lp__cc-plat" key={p}>
                              {p}
                            </span>
                          ))}
                        </div>
                        <div className="lp__cc-stats">
                          <div>
                            <div className="lp__cc-n">{c.followers}</div>
                            <div className="lp__cc-l">Followers</div>
                          </div>
                          <div>
                            <div className="lp__cc-n">{c.engagement}</div>
                            <div className="lp__cc-l">Engage</div>
                          </div>
                        </div>
                        <div className="lp__cc-foot">
                          <span className="lp__cc-rate">
                            {c.rate}
                            <small>/post</small>
                          </span>
                          <span className="lp__cc-invite">Invite</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating campaign status card */}
            <div className="lp__float lp__float--campaign">
              <div className="lp__float-eyebrow">Campaign · #2048</div>
              <div className="lp__float-row">
                <span className="lp__float-title">Summer Launch</span>
                <span className="nd-pill nd-pill--success">Open</span>
              </div>
              <div className="lp__float-meta">
                <div>
                  <span className="lp__float-k">$12,000</span>
                  <span className="lp__float-kl">Budget</span>
                </div>
                <div>
                  <span className="lp__float-k">24</span>
                  <span className="lp__float-kl">Applicants</span>
                </div>
                <div>
                  <span className="lp__float-k">6</span>
                  <span className="lp__float-kl">Shortlist</span>
                </div>
              </div>
              <div className="lp__float-bar">
                <i />
              </div>
            </div>

            {/* Floating collaboration timeline */}
            <div className="lp__float lp__float--timeline">
              <div className="lp__float-eyebrow">
                Collaboration · deliverable v2
              </div>
              {heroTimeline.map((s) => (
                <div className={'lp__step lp__step--' + s.state} key={s.label}>
                  <span className="lp__step-dot">{s.icon}</span>
                  <span className="lp__step-t">{s.label}</span>
                  <span className="lp__step-meta">{s.meta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logo strip */}
        <section className="lp__logos">
          <span className="nd-eyebrow" style={{ whiteSpace: 'nowrap' }}>
            Trusted by 2,300+ brands
          </span>
          <div className="lp__logo-row">
            {brandLogos.map(({ name, Logo }) => (
              <div className="lp__logo" key={name}>
                <Logo />
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
