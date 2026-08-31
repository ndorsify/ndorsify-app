import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import './draftReview.css'
import AppNav from '../../components/common/AppNav'
import { Avatar } from '../../components/common/ds'
import { PAGE_ROUTES, buildPath } from '../../routes'

const autoChecks = [
  { ok: true, label: 'Disclosure #ad present' },
  { ok: true, label: 'Product visible at 0:02' },
  { ok: true, label: 'No banned claims detected' }
]

const versions = [
  {
    label: 'Draft 2',
    meta: 'Apr 8, 2:14pm',
    state: 'Under review',
    tone: 'warn'
  },
  {
    label: 'Draft 1',
    meta: 'Apr 6, 9:30am',
    state: 'Changes requested',
    tone: 'muted'
  },
  { label: 'Brief shared', meta: 'Apr 3', state: '—', tone: 'muted' }
]

const initialThread = [
  {
    initials: 'RO',
    who: 'Rachel Oyelaran',
    stamp: 'at 0:34',
    time: 'Apr 6',
    text: 'Love the texture shot — can we hold on the product 1s longer before the swipe?'
  },
  {
    initials: 'MO',
    who: 'Maya Okonkwo',
    stamp: 'at 0:34',
    time: 'Apr 8',
    text: 'Done in draft 2 — held to 0:03 and re-shot the SPF layer under SPF.'
  }
]

export default function DraftReviewPage() {
  const navigate = useNavigate()
  const { id = '1' } = useParams()
  const [thread, setThread] = useState(initialThread)
  const [comment, setComment] = useState('')
  const [decision, setDecision] = useState(null)

  const sendFeedback = () => {
    if (!comment.trim()) return
    setThread((t) => [
      ...t,
      {
        initials: 'RO',
        who: 'Rachel Oyelaran',
        stamp: 'at 0:20',
        time: 'Just now',
        text: comment.trim()
      }
    ])
    setComment('')
  }

  const requestRevision = () => setDecision('revision')

  const approve = () => {
    setDecision('approved')
    setTimeout(
      () => navigate(buildPath(PAGE_ROUTES.CAMPAIGN_REPORT, { id })),
      900
    )
  }

  return (
    <>
      <AppNav />
      <div className="dr">
        <div className="dr__head">
          <div className="nd-stack" style={{ gap: 6 }}>
            <button
              className="nd-btn nd-btn--ghost nd-btn--sm"
              style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
              onClick={() => navigate(PAGE_ROUTES.CAMPAIGNS)}
            >
              ← Spring Glow Launch
            </button>
            <h1 className="nd-h1">Reel 1 · Maya Okonkwo</h1>
            <span
              className="nd-pill nd-pill--warn"
              style={{ alignSelf: 'flex-start' }}
            >
              Draft 2 · review by Apr 9, 6pm
            </span>
          </div>
          <div className="nd-row nd-wrap" style={{ gap: 10 }}>
            <button
              className="nd-btn nd-btn--secondary nd-btn--sm"
              onClick={requestRevision}
              disabled={decision === 'approved'}
            >
              Request revision
            </button>
            <button
              className="nd-btn nd-btn--primary nd-btn--sm"
              onClick={approve}
              disabled={decision === 'approved'}
            >
              {decision === 'approved'
                ? 'Approved ✓'
                : 'Approve & release $3,200'}
            </button>
          </div>
        </div>

        {decision === 'revision' && (
          <div className="nd-card nd-card--accent dr__banner">
            Revision requested — Maya has been notified and has 1 revision left.
          </div>
        )}

        <div className="dr__grid">
          <main className="nd-stack" style={{ gap: 16 }}>
            <div className="dr__video">
              <div className="dr__video-frame">
                <span className="dr__play">▶</span>
                <span className="dr__video-meta nd-mono">
                  draft reel · 9:16 · 0:52
                </span>
              </div>
              <div className="dr__scrub">
                <span className="nd-mono" style={{ fontSize: '0.72rem' }}>
                  0:20 / 0:52
                </span>
                <span className="dr__scrub-track">
                  <span className="dr__scrub-fill" />
                </span>
                <span className="nd-muted" style={{ fontSize: '0.72rem' }}>
                  2 timestamped comments
                </span>
              </div>
            </div>

            <div className="nd-row nd-wrap dr__checks">
              {autoChecks.map((c) => (
                <span className="dr__check" key={c.label}>
                  <span className="nd-ok">✓</span>
                  {c.label}
                </span>
              ))}
            </div>

            <div className="nd-card nd-stack" style={{ gap: 10 }}>
              <div className="nd-between">
                <div className="nd-h3">Caption</div>
                <button className="nd-btn nd-btn--ghost nd-btn--sm">
                  Suggest an edit
                </button>
              </div>
              <p
                className="nd-ink2"
                style={{ fontSize: '0.86rem', lineHeight: 1.6 }}
              >
                Three weeks with the Kettle &amp; Fern barrier serum in Lagos
                humidity — here's the texture, how I layer it under SPF, and my
                2-week check-in. #ad
              </p>
            </div>
          </main>

          <aside className="nd-stack" style={{ gap: 16 }}>
            <div className="nd-card nd-stack" style={{ gap: 12 }}>
              <div className="nd-between">
                <div className="nd-h3">Version history</div>
                <span className="nd-eyebrow">1 revision left</span>
              </div>
              <div className="nd-stack" style={{ gap: 10 }}>
                {versions.map((v) => (
                  <div className="nd-between dr__version" key={v.label}>
                    <span className="nd-stack" style={{ gap: 2 }}>
                      <span className="nd-h3" style={{ fontSize: '0.83rem' }}>
                        {v.label}
                      </span>
                      <span
                        className="nd-muted"
                        style={{ fontSize: '0.72rem' }}
                      >
                        {v.meta}
                      </span>
                    </span>
                    <span
                      className={
                        v.tone === 'warn'
                          ? 'nd-pill nd-pill--warn'
                          : 'nd-pill nd-pill--outline'
                      }
                    >
                      {v.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="nd-card nd-stack" style={{ gap: 12 }}>
              <div className="nd-h3">Feedback thread</div>
              <div className="nd-stack" style={{ gap: 14 }}>
                {thread.map((f, i) => (
                  <div className="dr__msg" key={i}>
                    <Avatar label={f.initials} size={30} />
                    <div className="nd-stack" style={{ gap: 3 }}>
                      <div className="nd-row" style={{ gap: 8 }}>
                        <span className="nd-h3" style={{ fontSize: '0.8rem' }}>
                          {f.who}
                        </span>
                        <span className="nd-pill nd-pill--code">{f.stamp}</span>
                        <span
                          className="nd-muted"
                          style={{ fontSize: '0.7rem' }}
                        >
                          {f.time}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                        {f.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <textarea
                className="nd-textarea"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment at 0:20…"
              />
              <div className="nd-row" style={{ gap: 8 }}>
                <button
                  className="nd-btn nd-btn--primary nd-btn--sm nd-grow"
                  onClick={sendFeedback}
                >
                  Send feedback
                </button>
                <button
                  className="nd-btn nd-btn--secondary nd-btn--sm"
                  onClick={approve}
                  disabled={decision === 'approved'}
                >
                  Approve as-is
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
