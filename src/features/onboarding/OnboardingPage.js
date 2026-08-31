import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import './onboarding.css'
import { PAGE_ROUTES } from '../../routes'
import { useGetCreatorQuestionsQuery } from './onboardingApi'

const STEPS = ['Basics', 'Connect platforms', 'Rate card', 'Review']

const initialPlatforms = [
  {
    id: 'ig',
    tag: 'IG',
    name: 'Instagram',
    detail: '@mayaokonkwo · 184K followers',
    connected: true
  },
  {
    id: 'tt',
    tag: 'TT',
    name: 'TikTok',
    detail: 'Connect to import reach',
    connected: false
  },
  {
    id: 'yt',
    tag: 'YT',
    name: 'YouTube',
    detail: 'Connect to import reach',
    connected: false
  },
  {
    id: 'x',
    tag: 'X',
    name: 'X / Twitter',
    detail: 'Connect to import reach',
    connected: false
  }
]

const suggestedRates = [
  { name: 'Instagram Reel', range: '$1,400 – $2,000' },
  { name: 'Story set (3)', range: '$600 – $900' },
  { name: 'TikTok video', range: '$1,100 – $1,600' }
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetCreatorQuestionsQuery()
  const categories = data || {}

  const [step, setStep] = useState(1)
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const [rates, setRates] = useState(
    suggestedRates.map((r) => ({ ...r, price: r.range }))
  )

  const connectedCount = platforms.filter((p) => p.connected).length
  const toggleConnect = (id) =>
    setPlatforms((rows) =>
      rows.map((p) => (p.id === id ? { ...p, connected: !p.connected } : p))
    )

  const checklist = [
    {
      done: true,
      current: false,
      title: 'Basics',
      hint: 'Name, niche, location'
    },
    {
      done: connectedCount >= 2,
      current: step === 2,
      title: 'Connect platforms',
      hint: `${connectedCount} of 2+ connected`
    },
    {
      done: false,
      current: step === 3,
      title: 'Rate card',
      hint: 'Set your prices'
    },
    {
      done: false,
      current: step === 4,
      title: 'Review & publish',
      hint: 'Go live for brands'
    }
  ]

  const finish = () => navigate(PAGE_ROUTES.PROFILE_EDIT)

  return (
    <div className="ob">
      <header className="ob__bar">
        <Link to={PAGE_ROUTES.HOME} className="nd-brand">
          <span className="nd-brand__mark" />
          <span className="nd-brand__word">Ndorsify</span>
        </Link>
        <span className="nd-eyebrow">
          Creator setup · {step} of {STEPS.length}
        </span>
        <button className="nd-btn nd-btn--ghost nd-btn--sm" onClick={finish}>
          Save &amp; finish later
        </button>
      </header>

      <div className="ob__progress">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={
              i + 1 === step
                ? 'ob__pip is-current'
                : i + 1 < step
                ? 'ob__pip is-done'
                : 'ob__pip'
            }
          >
            <span className="ob__pip-dot">{i + 1 < step ? '✓' : i + 1}</span>
            <span className="ob__pip-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="ob__grid">
        <main className="nd-stack" style={{ gap: 18 }}>
          {step === 1 && (
            <>
              <div className="nd-stack" style={{ gap: 8 }}>
                <span className="nd-eyebrow">Step 1 · Basics</span>
                <h1 className="nd-h1" style={{ fontSize: '1.6rem' }}>
                  Tell brands who you are
                </h1>
              </div>
              {isLoading && <div className="nd-empty">Loading questions…</div>}
              {isError && (
                <p className="nd-error">Couldn't load onboarding questions.</p>
              )}
              {Object.entries(categories).map(([category, questions]) => (
                <div className="nd-card" key={category}>
                  <div className="nd-h2" style={{ marginBottom: 14 }}>
                    {category}
                  </div>
                  {(questions || []).map((q, i) => (
                    <label className="nd-field" key={`${category}-${i}`}>
                      <span>{q.question}</span>
                      <input
                        className="nd-input"
                        placeholder={q.dataType || 'Your answer'}
                      />
                    </label>
                  ))}
                </div>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <div className="nd-stack" style={{ gap: 8 }}>
                <span className="nd-eyebrow">
                  Step 2 · Connect your platforms
                </span>
                <h1 className="nd-h1" style={{ fontSize: '1.6rem' }}>
                  Let brands see real numbers
                </h1>
                <p
                  className="nd-ink2"
                  style={{ fontSize: '0.88rem', maxWidth: 540 }}
                >
                  We read follower count, engagement and audience demographics
                  through official APIs. We never post on your behalf.
                </p>
              </div>
              <div className="nd-stack" style={{ gap: 10 }}>
                {platforms.map((p) => (
                  <div
                    className={
                      p.connected ? 'ob__platform is-on' : 'ob__platform'
                    }
                    key={p.id}
                  >
                    <span className="ob__platform-tag nd-mono">{p.tag}</span>
                    <span className="nd-grow nd-stack" style={{ gap: 2 }}>
                      <span className="nd-h3" style={{ fontSize: '0.88rem' }}>
                        {p.name}
                      </span>
                      <span
                        className="nd-muted"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {p.connected ? p.detail : 'Connect to import reach'}
                      </span>
                    </span>
                    <button
                      className={
                        p.connected
                          ? 'nd-btn nd-btn--secondary nd-btn--sm'
                          : 'nd-btn nd-btn--primary nd-btn--sm'
                      }
                      onClick={() => toggleConnect(p.id)}
                    >
                      {p.connected ? 'Connected ✓' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
              <div
                className="nd-card nd-card--accent nd-stack"
                style={{ gap: 5 }}
              >
                <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
                  Connect two or more platforms
                </div>
                <p
                  className="nd-ink2"
                  style={{ fontSize: '0.78rem', lineHeight: 1.55 }}
                >
                  Multi-platform creators appear in 3× more brand searches and
                  earn 41% more per campaign on average.
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="nd-stack" style={{ gap: 8 }}>
                <span className="nd-eyebrow">Step 3 · Rate card</span>
                <h1 className="nd-h1" style={{ fontSize: '1.6rem' }}>
                  Set your prices
                </h1>
                <p
                  className="nd-ink2"
                  style={{ fontSize: '0.88rem', maxWidth: 540 }}
                >
                  Pre-filled from creators with similar reach and engagement in
                  your niche. Adjust anything — nothing is published yet.
                </p>
              </div>
              <div className="nd-stack" style={{ gap: 10 }}>
                {rates.map((r, i) => (
                  <div className="ob__rate" key={r.name}>
                    <span
                      className="nd-grow nd-h3"
                      style={{ fontSize: '0.86rem' }}
                    >
                      {r.name}
                    </span>
                    <input
                      className="nd-input ob__rate-input"
                      value={r.price}
                      onChange={(e) =>
                        setRates((rows) =>
                          rows.map((row, j) =>
                            j === i ? { ...row, price: e.target.value } : row
                          )
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="nd-stack" style={{ gap: 8 }}>
                <span className="nd-eyebrow">Step 4 · Review</span>
                <h1 className="nd-h1" style={{ fontSize: '1.6rem' }}>
                  You're campaign-ready
                </h1>
                <p
                  className="nd-ink2"
                  style={{ fontSize: '0.88rem', maxWidth: 540 }}
                >
                  {connectedCount} platform{connectedCount === 1 ? '' : 's'}{' '}
                  connected · {rates.length} rate-card packages set. Publish to
                  start receiving brand invitations.
                </p>
              </div>
              <div className="nd-card nd-stack" style={{ gap: 10 }}>
                <div className="nd-h3">Summary</div>
                {checklist.map((c) => (
                  <div className="nd-between ob__summary" key={c.title}>
                    <span style={{ fontSize: '0.84rem' }}>{c.title}</span>
                    <span className="nd-muted" style={{ fontSize: '0.76rem' }}>
                      {c.hint}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="ob__nav">
            {step > 1 ? (
              <button
                className="nd-btn nd-btn--ghost nd-btn--sm"
                onClick={() => setStep((s) => s - 1)}
              >
                ← Back
              </button>
            ) : (
              <span />
            )}
            <div className="nd-row" style={{ gap: 10 }}>
              {step < STEPS.length && (
                <button
                  className="nd-btn nd-btn--secondary nd-btn--sm"
                  onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
                >
                  Skip for now
                </button>
              )}
              {step < STEPS.length ? (
                <button
                  className="nd-btn nd-btn--primary nd-btn--sm"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Continue → {STEPS[step]}
                </button>
              ) : (
                <button
                  className="nd-btn nd-btn--primary nd-btn--sm"
                  onClick={finish}
                >
                  Publish profile
                </button>
              )}
            </div>
          </div>
        </main>

        <aside className="nd-stack" style={{ gap: 16 }}>
          <div className="nd-card nd-stack" style={{ gap: 12 }}>
            <span className="nd-eyebrow">Setup checklist</span>
            {checklist.map((c) => (
              <div
                className="nd-row ob__check"
                style={{ gap: 10 }}
                key={c.title}
              >
                <span
                  className={
                    c.done
                      ? 'nd-check is-done'
                      : c.current
                      ? 'nd-check is-current'
                      : 'nd-check'
                  }
                >
                  {c.done ? '✓' : ''}
                </span>
                <span className="nd-grow nd-stack" style={{ gap: 1 }}>
                  <span className="nd-h3" style={{ fontSize: '0.82rem' }}>
                    {c.title}
                  </span>
                  <span className="nd-muted" style={{ fontSize: '0.72rem' }}>
                    {c.hint}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {step === 2 && (
            <div className="nd-card nd-stack" style={{ gap: 10 }}>
              <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
                Suggested rate card
              </div>
              <p
                className="nd-muted"
                style={{ fontSize: '0.73rem', lineHeight: 1.5 }}
              >
                Based on 184K followers at 5.2% engagement in Beauty &amp;
                Skincare, comparable creators charge:
              </p>
              <div className="nd-stack" style={{ gap: 8 }}>
                {suggestedRates.map((r) => (
                  <div className="nd-between" key={r.name}>
                    <span style={{ fontSize: '0.8rem' }}>{r.name}</span>
                    <span
                      className="nd-mono nd-ink2"
                      style={{ fontSize: '0.78rem' }}
                    >
                      {r.range}
                    </span>
                  </div>
                ))}
              </div>
              <p className="nd-muted" style={{ fontSize: '0.72rem' }}>
                You set the final numbers in step 3 — nothing is published yet.
              </p>
            </div>
          )}

          <div className="nd-card nd-card--accent nd-stack" style={{ gap: 6 }}>
            <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
              Creators keep 100%
            </div>
            <p
              className="nd-ink2"
              style={{ fontSize: '0.77rem', lineHeight: 1.55 }}
            >
              Ndorsify charges the brand a 5% fee. Nothing is deducted from your
              rate.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
