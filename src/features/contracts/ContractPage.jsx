import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './contract.css'
import AppNav from '../../components/common/AppNav'
import { PAGE_ROUTES, buildPath } from '../../routes'

const clauses = [
  {
    num: 1,
    title: 'Scope of work',
    body: 'Creator will produce 2 Instagram Reels and 3 Instagram Stories for the Spring Glow Launch campaign, matching the accepted offer dated Apr 3, 2026 and the brief attached as Exhibit A.'
  },
  {
    num: 2,
    title: 'Compensation & escrow',
    body: '$3,200 is held in Ndorsify escrow and released to the Creator 48 hours after the final Reel goes live and is approved. No platform fee is deducted from the Creator.'
  },
  {
    num: 3,
    title: 'Usage rights',
    body: 'Organic rights only for 90 days. The Brand may not run paid promotion against this content without a separate paid-usage addendum agreed by both parties.'
  },
  {
    num: 4,
    title: 'Revisions & approval',
    body: 'One revision round is included, with a 48-hour Brand review window per draft. If the Brand does not respond within the window, the draft auto-approves.'
  },
  {
    num: 5,
    title: 'Disclosure & compliance',
    body: 'Creator will include a clear #ad disclosure and comply with FTC endorsement guidelines. No banned claims (e.g. "cures", "dermatologist approved") may be made.'
  },
  {
    num: 6,
    title: 'Termination',
    body: 'Either party may cancel before filming begins; escrowed funds are refunded to the Brand in full. After filming, cancellation is subject to a 50% kill fee.'
  }
]

const keyTerms = [
  { label: 'Your fee', value: '$3,200' },
  { label: 'Deliverables', value: '2 Reels + 3 Stories' },
  { label: 'Usage', value: 'Organic · 90 days' },
  { label: 'Revisions', value: '1 round · 48h review' },
  { label: 'Draft due', value: 'Apr 3, 2026' },
  { label: 'Payout', value: 'Apr 14 (48h after live)' }
]

export default function ContractPage() {
  const navigate = useNavigate()
  const { id = '1' } = useParams()
  const [typed, setTyped] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [signed, setSigned] = useState(false)

  const canSign = typed.trim().length > 1 && confirmed && !signed

  const onSign = () => {
    setSigned(true)
    setTimeout(() => navigate(buildPath(PAGE_ROUTES.DRAFT_REVIEW, { id })), 900)
  }

  return (
    <>
      <AppNav />
      <div className="ct">
        <div className="ct__head">
          <div className="nd-stack" style={{ gap: 6 }}>
            <button
              className="nd-btn nd-btn--ghost nd-btn--sm"
              style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
              onClick={() => navigate(PAGE_ROUTES.COLLABORATIONS)}
            >
              ← My deals
            </button>
            <h1 className="nd-h1">Collaboration agreement</h1>
            <span
              className={
                signed ? 'nd-pill nd-pill--success' : 'nd-pill nd-pill--warn'
              }
              style={{ alignSelf: 'flex-start' }}
            >
              {signed ? 'Signed — deal started' : 'Awaiting your signature'}
            </span>
          </div>
          <div className="nd-row nd-wrap" style={{ gap: 10 }}>
            <button className="nd-btn nd-btn--secondary nd-btn--sm">
              Download PDF
            </button>
            <button className="nd-btn nd-btn--ghost nd-btn--sm">
              Request a change
            </button>
          </div>
        </div>

        <div className="ct__grid">
          <main className="ct__doc">
            <div className="ct__doc-head">
              <div className="nd-stack" style={{ gap: 3 }}>
                <div className="nd-h2">Creator Services Agreement</div>
                <span className="nd-eyebrow">
                  NDSF-2026-04812 · Generated Apr 6, 2026
                </span>
              </div>
              <span className="nd-pill nd-pill--outline">Page 1 / 4</span>
            </div>

            <div className="nd-stack ct__clauses" style={{ gap: 18 }}>
              {clauses.map((c) => (
                <div className="ct__clause" key={c.num}>
                  <span className="ct__clause-num nd-mono">{c.num}</span>
                  <div className="nd-stack" style={{ gap: 4 }}>
                    <div className="nd-h3" style={{ fontSize: '0.9rem' }}>
                      {c.title}
                    </div>
                    <p
                      className="nd-ink2"
                      style={{ fontSize: '0.84rem', lineHeight: 1.6 }}
                    >
                      {c.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ct__sigs">
              <div className="ct__sig">
                <span className="nd-eyebrow">Brand — signed</span>
                <div className="ct__sig-name ct__sig-name--ink">
                  Rachel Oyelaran
                </div>
                <span className="nd-muted" style={{ fontSize: '0.72rem' }}>
                  Apr 6, 2026 · 09:52 GMT+1
                </span>
              </div>
              <div className={signed ? 'ct__sig is-done' : 'ct__sig'}>
                <span className="nd-eyebrow">Creator — your signature</span>
                <div className="ct__sig-name">
                  {signed ? typed || 'Maya Okonkwo' : 'Click to sign →'}
                </div>
                <span className="nd-muted" style={{ fontSize: '0.72rem' }}>
                  Typed signatures are legally binding
                </span>
              </div>
            </div>
          </main>

          <aside className="nd-stack" style={{ gap: 16 }}>
            <div className="nd-card nd-stack" style={{ gap: 12 }}>
              <div className="nd-h3">Key terms at a glance</div>
              <div className="nd-stack" style={{ gap: 10 }}>
                {keyTerms.map((t) => (
                  <div className="nd-between ct__term" key={t.label}>
                    <span className="nd-muted" style={{ fontSize: '0.78rem' }}>
                      {t.label}
                    </span>
                    <span
                      className="nd-mono"
                      style={{ fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      {t.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="nd-card nd-card--accent nd-stack"
              style={{ gap: 12 }}
            >
              <label className="nd-field" style={{ gap: 6 }}>
                <span>Sign as Maya Okonkwo</span>
                <input
                  className="nd-input ct__sign-input"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="Maya Okonkwo"
                  disabled={signed}
                />
              </label>
              <label className="ct__check">
                <span
                  className={confirmed ? 'nd-check is-done' : 'nd-check'}
                  onClick={() => !signed && setConfirmed((v) => !v)}
                  role="checkbox"
                  aria-checked={confirmed}
                  tabIndex={0}
                  style={{ marginTop: 2 }}
                >
                  {confirmed ? '✓' : ''}
                </span>
                <span style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                  I have read the agreement and confirm I can deliver by the
                  dates listed.
                </span>
              </label>
              <button
                className="nd-btn nd-btn--primary nd-btn--lg nd-btn--block"
                onClick={onSign}
                disabled={!canSign}
              >
                {signed ? 'Signed ✓' : 'Sign & start the deal'}
              </button>
              <p
                className="nd-ink2"
                style={{ fontSize: '0.76rem', textAlign: 'center' }}
              >
                $3,200 is already in escrow for you.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
