import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import './campaignBuilder.css'
import AppNav from '../../components/common/AppNav'
import { Avatar, Toggle } from '../../components/common/ds'
import { PAGE_ROUTES, buildPath } from '../../routes'
import { apiErrorMessage } from '../../lib/errors'
import { money } from '../../lib/format'
import {
  useCreateCampaignMutation,
  usePublishCampaignMutation
} from './campaignApi'
import { selectIsAuthed } from '../auth/authSlice'
import { builderShortlist, builderSteps } from '../../lib/sampleData'

const USAGE = ['Organic only', 'Paid ads 30d', 'Perpetual']
const REVIEW_WINDOWS = ['24h', '48h', '72h']

// Explicit platform enum the backend accepts — a deliverable's platform is
// picked from this list, never guessed from its free-text label.
const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter/X' }
]
const DEFAULT_PLATFORM = PLATFORMS[0].value

const initialDeliverables = [
  {
    id: 1,
    platform: 'instagram',
    type: 'Instagram Reel',
    spec: '30–45s, product in first 3s',
    qty: 2,
    rate: 1600
  },
  {
    id: 2,
    platform: 'instagram',
    type: 'Instagram Stories',
    spec: 'Swipe-up to product page',
    qty: 3,
    rate: 300
  },
  {
    id: 3,
    platform: 'tiktok',
    type: 'TikTok video',
    spec: 'Native, 20–40s',
    qty: 1,
    rate: 1200
  }
]

const scheduleBars = [
  {
    name: 'Content window',
    label: 'Apr 6 – Apr 20',
    start: 0,
    span: 3,
    tone: 'accent'
  },
  { name: 'Review', label: 'Apr 20 – Apr 24', start: 3, span: 1, tone: 'warn' },
  { name: 'Live', label: 'Apr 24 – May 4', start: 4, span: 2, tone: 'success' }
]

const inviteRows = [
  {
    initials: 'MO',
    name: 'Maya Okonkwo',
    niche: 'Beauty & Skincare',
    reach: '184K',
    rate: '$3,200',
    offer: '$3,200',
    fit: '94%'
  },
  {
    initials: 'NM',
    name: 'Naledi Mokoena',
    niche: 'Clean skincare',
    reach: '156K',
    rate: '$3,000',
    offer: '$3,000',
    fit: '91%'
  },
  {
    initials: 'AD',
    name: 'Amara Diallo',
    niche: 'Ingredient-first',
    reach: '132K',
    rate: '$2,600',
    offer: '$2,600',
    fit: '89%'
  },
  {
    initials: 'CR',
    name: 'Cass Rivera',
    niche: 'Beauty',
    reach: '121K',
    rate: '$2,400',
    offer: '$2,400',
    fit: '87%'
  }
]

// ISO (YYYY-MM-DD) offset from today — used to seed sensible default dates so
// the flow stays walkable and the seeded draft is publishable out of the box.
const isoInDays = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

// "2026-09-01" → "Sep 1" for the milestone/gantt labels.
const shortDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function CampaignBuilderPage() {
  const navigate = useNavigate()
  const [create, { isLoading: creating, error: createError }] =
    useCreateCampaignMutation()
  const [publish, { isLoading: publishing, error: publishError }] =
    usePublishCampaignMutation()
  const isLoading = creating || publishing
  const error = createError || publishError
  // An authed session (access OR persisted refresh token) means a real backend
  // session — gate on refresh too, so a page reload mid-builder (which clears
  // the in-memory access token) still hits the API: the reauth base query
  // silently exchanges the refresh token on the first 401. Without a token of
  // either kind we're in sample-data mode and skip the API so the flow stays
  // walkable.
  const liveSession = useSelector(selectIsAuthed)

  const [step, setStep] = useState(3)
  const [title, setTitle] = useState('Spring Glow Launch')
  const [objective, setObjective] = useState(
    'Drive awareness for the spring ceramide serum launch.'
  )
  const [startsOn, setStartsOn] = useState(isoInDays(7))
  const [endsOn, setEndsOn] = useState(isoInDays(37))
  const [deliverables, setDeliverables] = useState(initialDeliverables)
  const [usage, setUsage] = useState('Organic only')
  const [approval, setApproval] = useState(true)
  const [reviewWindow, setReviewWindow] = useState('48h')
  const [stagger, setStagger] = useState(true)
  const [exclusivity, setExclusivity] = useState(false)
  const [message, setMessage] = useState(
    "Hi {first name} — we're launching a ceramide barrier serum in April and your ingredient-first content is exactly the tone we want. Full brief attached; happy to talk rate."
  )

  const setField = (id, key, value) =>
    setDeliverables((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    )
  const removeRow = (id) =>
    setDeliverables((rows) => rows.filter((r) => r.id !== id))
  const addRow = () =>
    setDeliverables((rows) => [
      ...rows,
      {
        id: Date.now(),
        platform: DEFAULT_PLATFORM,
        type: 'New deliverable',
        spec: 'Describe the deliverable',
        qty: 1,
        rate: 500
      }
    ])

  const creatorSubtotal = deliverables.reduce(
    (sum, d) => sum + d.qty * d.rate,
    0
  )
  const usageAdd =
    usage === 'Organic only' ? 0 : Math.round(creatorSubtotal * 0.25)
  const exclusivityAdd = exclusivity
    ? Math.round((creatorSubtotal + usageAdd) * 0.1)
    : 0
  const service = Math.round(
    (creatorSubtotal + usageAdd + exclusivityAdd) * 0.09
  )
  const total = creatorSubtotal + usageAdd + exclusivityAdd + service

  const budgetLines = [
    { label: 'Creator rates', value: money(creatorSubtotal) },
    { label: 'Paid usage add-on', value: money(usageAdd) },
    { label: 'Exclusivity add-on', value: money(exclusivityAdd) },
    { label: 'Ndorsify service', value: money(service) }
  ]

  const reviewChecklist = [
    {
      mark: 'ok',
      label: 'Deliverables',
      detail: '2 Reels + 3 Stories per creator'
    },
    { mark: 'ok', label: 'Budget', detail: `${money(total)} total incl. fees` },
    {
      mark: objective.trim() && startsOn && endsOn ? 'ok' : 'warn',
      label: 'Timeline',
      detail: `${shortDate(startsOn)} – ${shortDate(endsOn)}`
    },
    { mark: 'warn', label: 'Usage rights', detail: usage }
  ]

  // Sidebar step states derive from the active step (step is 3–5, 1-based).
  const stepState = (i) => {
    if (i < step - 1) return 'done'
    if (i === step - 1) return 'current'
    return 'todo'
  }

  const [localError, setLocalError] = useState('')

  // Create the draft, then flip it to "open" via /publish. Returns the new
  // campaign id, or null if anything failed (error surfaced inline).
  const createAndPublish = async () => {
    const created = await create({
      title,
      objective,
      platforms: [...new Set(deliverables.map((d) => d.platform))],
      deliverables: deliverables.map((d) => ({
        platform: d.platform,
        type: d.type,
        quantity: d.qty
      })),
      budget_amount: total,
      budget_currency: 'USD',
      starts_on: startsOn,
      ends_on: endsOn,
      target_audience: {}
    }).unwrap()
    await publish(created.id).unwrap()
    return created.id
  }

  const onPublish = async () => {
    setLocalError('')
    // Publish requires objective + a valid timeline; guard client-side so the
    // brand lands back on the step that's missing rather than a raw 422.
    if (!objective.trim() || !startsOn || !endsOn) {
      setLocalError('Add an objective and a start/end date before publishing.')
      return setStep(4)
    }
    if (endsOn < startsOn) {
      setLocalError('The end date must be on or after the start date.')
      return setStep(4)
    }
    if (!liveSession) {
      // Sample-data mode: keep the flow walkable without a backend.
      return navigate(buildPath(PAGE_ROUTES.CAMPAIGN_FUND, { id: '1' }))
    }
    try {
      const id = await createAndPublish()
      navigate(buildPath(PAGE_ROUTES.CAMPAIGN_FUND, { id: String(id) }))
    } catch {
      /* rendered inline via `error`; stay on the page */
    }
  }

  const primary = {
    3: { label: 'Continue → Timeline', onClick: () => setStep(4) },
    4: { label: 'Continue → Invite creators', onClick: () => setStep(5) },
    5: {
      label: isLoading ? 'Publishing…' : 'Publish & send 8 invites',
      onClick: onPublish
    }
  }[step]

  const pillText = {
    3: 'Draft · autosaved 1m ago',
    4: 'Draft · step 4 of 5',
    5: 'Ready to publish · step 5 of 5'
  }[step]

  return (
    <>
      <AppNav />
      <div className="cb">
        <div className="cb__bar">
          <div className="nd-row" style={{ gap: 14 }}>
            <button
              className="nd-btn nd-btn--ghost nd-btn--sm"
              onClick={() => navigate(-1)}
            >
              ✕ Exit
            </button>
            <input
              className="cb__title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <span
              className={
                step === 5
                  ? 'nd-pill nd-pill--success'
                  : 'nd-pill nd-pill--warn'
              }
            >
              {pillText}
            </span>
          </div>
          <div className="nd-row" style={{ gap: 10 }}>
            {step > 3 && (
              <button
                className="nd-btn nd-btn--secondary nd-btn--sm"
                onClick={() => setStep((s) => s - 1)}
              >
                {step === 4 ? '← Deliverables' : '← Timeline'}
              </button>
            )}
            <button
              className="nd-btn nd-btn--primary nd-btn--sm"
              onClick={primary.onClick}
              disabled={isLoading}
            >
              {primary.label}
            </button>
          </div>
        </div>

        <div className="cb__body">
          {/* Steps */}
          <aside className="cb__steps">
            <span className="nd-eyebrow" style={{ paddingBottom: 6 }}>
              Campaign setup
            </span>
            {builderSteps.map((s, i) => {
              const state = stepState(i)
              return (
                <div className={`cb__step cb__step--${state}`} key={s.title}>
                  <span className="cb__step-dot">
                    {state === 'done' ? '✓' : i + 1}
                  </span>
                  <div>
                    <div className="cb__step-title">{s.title}</div>
                    <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
                      {s.hint}
                    </div>
                  </div>
                </div>
              )
            })}
            {step === 4 ? (
              <div className="cb__template">
                <div className="nd-h3" style={{ fontSize: '0.82rem' }}>
                  Tight for Mother's Day?
                </div>
                <div
                  className="nd-ink2"
                  style={{ fontSize: '0.75rem', lineHeight: 1.55 }}
                >
                  Creators need 10+ days between booking and go-live for filmed
                  deliverables.
                </div>
              </div>
            ) : (
              <div className="cb__template">
                <div className="nd-h3" style={{ fontSize: '0.82rem' }}>
                  Need a template?
                </div>
                <div
                  className="nd-ink2"
                  style={{ fontSize: '0.75rem', lineHeight: 1.55 }}
                >
                  Start from “Product launch — beauty” and edit the
                  deliverables.
                </div>
              </div>
            )}
          </aside>

          {/* Center */}
          <main className="cb__main">
            {step === 3 && (
              <DeliverablesStep
                objective={objective}
                setObjective={setObjective}
                deliverables={deliverables}
                setField={setField}
                removeRow={removeRow}
                addRow={addRow}
                usage={usage}
                setUsage={setUsage}
                approval={approval}
                setApproval={setApproval}
                error={error}
              />
            )}
            {step === 4 && (
              <TimelineStep
                startsOn={startsOn}
                setStartsOn={setStartsOn}
                endsOn={endsOn}
                setEndsOn={setEndsOn}
                reviewWindow={reviewWindow}
                setReviewWindow={setReviewWindow}
                stagger={stagger}
                setStagger={setStagger}
                exclusivity={exclusivity}
                setExclusivity={setExclusivity}
                error={error}
                localError={localError}
              />
            )}
            {step === 5 && (
              <InviteStep message={message} setMessage={setMessage} />
            )}
          </main>

          {/* Right rail */}
          {step === 5 ? (
            <PublishRail
              total={total}
              checklist={reviewChecklist}
              onPublish={primary.onClick}
              publishing={isLoading}
              error={error}
              localError={localError}
            />
          ) : (
            <BudgetRail budgetLines={budgetLines} total={total} />
          )}
        </div>
      </div>
    </>
  )
}

function DeliverablesStep({
  objective,
  setObjective,
  deliverables,
  setField,
  removeRow,
  addRow,
  usage,
  setUsage,
  approval,
  setApproval,
  error
}) {
  return (
    <>
      <div className="nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Step 3 · Deliverables</span>
        <h1 className="nd-h1" style={{ fontSize: '1.75rem' }}>
          What should creators produce?
        </h1>
        <div className="nd-ink2" style={{ fontSize: '0.88rem', maxWidth: 560 }}>
          Every line item is priced per creator. Creators can counter-offer on
          rate before accepting.
        </div>
      </div>

      <div className="nd-card nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Campaign objective</span>
        <textarea
          className="nd-textarea"
          rows={2}
          placeholder="What is this campaign trying to achieve?"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />
        <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
          Shown to creators in the marketplace listing. Required to publish.
        </div>
      </div>

      <div className="nd-stack" style={{ gap: 12 }}>
        {deliverables.map((d) => (
          <div className="cb__deliv" key={d.id}>
            <div className="nd-stack" style={{ gap: 5 }}>
              <input
                className="cb__deliv-type"
                value={d.type}
                onChange={(e) => setField(d.id, 'type', e.target.value)}
              />
              <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
                {d.spec}
              </div>
            </div>
            <div className="nd-stack" style={{ gap: 5 }}>
              <span className="nd-eyebrow">Platform</span>
              <select
                className="cb__num"
                value={d.platform}
                onChange={(e) => setField(d.id, 'platform', e.target.value)}
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="nd-stack" style={{ gap: 5 }}>
              <span className="nd-eyebrow">Qty</span>
              <input
                className="cb__num"
                type="number"
                min="1"
                value={d.qty}
                onChange={(e) =>
                  setField(d.id, 'qty', Number(e.target.value) || 0)
                }
              />
            </div>
            <div className="nd-stack" style={{ gap: 5 }}>
              <span className="nd-eyebrow">Rate / creator</span>
              <input
                className="cb__num"
                type="number"
                min="0"
                value={d.rate}
                onChange={(e) =>
                  setField(d.id, 'rate', Number(e.target.value) || 0)
                }
              />
            </div>
            <button
              className="cb__remove"
              onClick={() => removeRow(d.id)}
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        <button className="nd-add" onClick={addRow}>
          + Add deliverable
        </button>
      </div>

      <div className="cb__opts">
        <div className="nd-card nd-card--tight nd-stack" style={{ gap: 9 }}>
          <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
            Usage rights
          </div>
          <div className="nd-row nd-wrap" style={{ gap: 8 }}>
            {USAGE.map((u) => (
              <button
                key={u}
                className={u === usage ? 'cb__chip is-on' : 'cb__chip'}
                onClick={() => setUsage(u)}
              >
                {u}
              </button>
            ))}
          </div>
          <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
            Paid usage adds ~25% to each creator's rate.
          </div>
        </div>
        <div className="nd-card nd-card--tight nd-stack" style={{ gap: 9 }}>
          <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
            Approval
          </div>
          <div className="nd-row" style={{ gap: 10 }}>
            <Toggle on={approval} onClick={() => setApproval((v) => !v)} />
            <span style={{ fontSize: '0.8rem' }}>
              Require draft approval before posting
            </span>
          </div>
          <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
            One revision round included, 48h review window.
          </div>
        </div>
      </div>
      {error && <p className="nd-error">{apiErrorMessage(error)}</p>}
    </>
  )
}

function TimelineStep({
  startsOn,
  setStartsOn,
  endsOn,
  setEndsOn,
  reviewWindow,
  setReviewWindow,
  stagger,
  setStagger,
  exclusivity,
  setExclusivity,
  error,
  localError
}) {
  // Milestone cards mirror the dates the brand actually picked.
  const liveMilestones = [
    {
      label: 'Content window',
      value: `${shortDate(startsOn)} – ${shortDate(endsOn)}`,
      rel: 'Booking → go-live'
    },
    { label: 'Review', value: `${reviewWindow} per draft`, rel: 'Turnaround' },
    { label: 'Live from', value: shortDate(endsOn), rel: 'Posts go public' }
  ]
  return (
    <>
      <div className="nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Step 4 · Timeline</span>
        <h1 className="nd-h1" style={{ fontSize: '1.75rem' }}>
          When does everything happen?
        </h1>
      </div>

      <div className="nd-card cb__opts" style={{ gap: 16 }}>
        <div className="nd-stack" style={{ gap: 6 }}>
          <span className="nd-eyebrow">Start date</span>
          <input
            className="nd-input"
            type="date"
            value={startsOn || ''}
            onChange={(e) => setStartsOn(e.target.value)}
          />
        </div>
        <div className="nd-stack" style={{ gap: 6 }}>
          <span className="nd-eyebrow">End date</span>
          <input
            className="nd-input"
            type="date"
            value={endsOn || ''}
            min={startsOn || undefined}
            onChange={(e) => setEndsOn(e.target.value)}
          />
        </div>
      </div>

      <div className="cb__milestones">
        {liveMilestones.map((d) => (
          <div className="cb__milestone" key={d.label}>
            <span className="nd-eyebrow">{d.label}</span>
            <span className="nd-h3" style={{ fontSize: '0.92rem' }}>
              {d.value}
            </span>
            <span className="nd-muted" style={{ fontSize: '0.72rem' }}>
              {d.rel}
            </span>
          </div>
        ))}
      </div>

      {(localError || error) && (
        <p className="nd-error">{localError || apiErrorMessage(error)}</p>
      )}

      <div className="nd-card nd-stack" style={{ gap: 14 }}>
        <div className="nd-between">
          <div className="nd-h3">Schedule preview</div>
        </div>
        <div className="cb__gantt-scale">
          {['Apr 6', 'Apr 13', 'Apr 20', 'Apr 27', 'May 4', 'May 11'].map(
            (t) => (
              <span key={t} className="nd-mono">
                {t}
              </span>
            )
          )}
        </div>
        <div className="cb__gantt">
          {scheduleBars.map((g) => (
            <div className="cb__gantt-row" key={g.name}>
              <span className="cb__gantt-name">{g.name}</span>
              <span className="cb__gantt-track">
                <span
                  className={`cb__gantt-bar cb__gantt-bar--${g.tone}`}
                  style={{
                    gridColumn: `${g.start + 1} / span ${g.span}`
                  }}
                >
                  {g.label}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="cb__opts">
        <div className="nd-card nd-card--tight nd-stack" style={{ gap: 10 }}>
          <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
            Review window
          </div>
          <div className="nd-seg">
            {REVIEW_WINDOWS.map((w) => (
              <button
                key={w}
                className={
                  w === reviewWindow ? 'nd-seg__item is-active' : 'nd-seg__item'
                }
                onClick={() => setReviewWindow(w)}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
            Drafts auto-approve if you don't respond.
          </div>
        </div>
        <div className="nd-card nd-card--tight nd-stack" style={{ gap: 10 }}>
          <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
            Posting cadence
          </div>
          <div className="nd-row" style={{ gap: 10 }}>
            <Toggle on={stagger} onClick={() => setStagger((v) => !v)} />
            <span style={{ fontSize: '0.8rem' }}>
              Stagger posts across the window
            </span>
          </div>
          <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
            Max 2 creators live on the same day.
          </div>
        </div>
        <div className="nd-card nd-card--tight nd-stack" style={{ gap: 10 }}>
          <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
            Exclusivity
          </div>
          <div className="nd-row" style={{ gap: 10 }}>
            <Toggle
              on={exclusivity}
              onClick={() => setExclusivity((v) => !v)}
            />
            <span style={{ fontSize: '0.8rem' }}>
              No competitor posts for 14 days
            </span>
          </div>
          <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
            Adds ~10% to each creator's rate.
          </div>
        </div>
      </div>
    </>
  )
}

function InviteStep({ message, setMessage }) {
  return (
    <>
      <div className="nd-between nd-wrap" style={{ gap: 12 }}>
        <div className="nd-stack" style={{ gap: 8 }}>
          <span className="nd-eyebrow">Step 5 · Invite creators</span>
          <h1 className="nd-h1" style={{ fontSize: '1.75rem' }}>
            8 creators shortlisted · $38,400 in offers
          </h1>
        </div>
        <div className="nd-row nd-wrap" style={{ gap: 8 }}>
          <button className="nd-btn nd-btn--secondary nd-btn--sm">
            Add from discovery
          </button>
          <button className="nd-btn nd-btn--ghost nd-btn--sm">
            Suggest 5 more
          </button>
        </div>
      </div>

      <div className="nd-card">
        <div className="nd-thead cb__invite-row">
          <span>Creator</span>
          <span>Reach est.</span>
          <span>Their rate</span>
          <span>Your offer</span>
          <span>Fit</span>
        </div>
        {inviteRows.map((i) => (
          <div className="nd-trow cb__invite-row" key={i.name}>
            <span className="nd-row" style={{ gap: 10 }}>
              <Avatar label={i.initials} size={30} />
              <span className="nd-stack" style={{ gap: 1 }}>
                <span className="nd-h3" style={{ fontSize: '0.82rem' }}>
                  {i.name}
                </span>
                <span className="nd-muted" style={{ fontSize: '0.7rem' }}>
                  {i.niche}
                </span>
              </span>
            </span>
            <span className="nd-mono" style={{ fontSize: '0.8rem' }}>
              {i.reach}
            </span>
            <span className="nd-mono nd-ink2" style={{ fontSize: '0.8rem' }}>
              {i.rate}
            </span>
            <span
              className="nd-mono"
              style={{ fontSize: '0.8rem', fontWeight: 600 }}
            >
              {i.offer}
            </span>
            <span className="nd-pill nd-pill--success">{i.fit}</span>
          </div>
        ))}
      </div>

      <div className="nd-card nd-stack" style={{ gap: 10 }}>
        <div className="nd-between">
          <div className="nd-h3">Invitation message</div>
          <span className="nd-eyebrow">Personalise per creator</span>
        </div>
        <textarea
          className="nd-textarea"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </>
  )
}

function BudgetRail({ budgetLines, total }) {
  return (
    <aside className="cb__budget">
      <div className="nd-h3">Budget summary</div>
      <div className="nd-stack" style={{ gap: 11 }}>
        {budgetLines.map((b) => (
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
      </div>
      <div className="cb__total">
        <span className="nd-h3" style={{ fontSize: '0.85rem' }}>
          Total budget
        </span>
        <span
          className="nd-mono"
          style={{ fontSize: '1.35rem', fontWeight: 500 }}
        >
          {money(total)}
        </span>
      </div>
      <div className="cb__reach">
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--accent-press)'
          }}
        >
          Projected reach 1.9M–2.4M
        </div>
        <div
          className="nd-ink2"
          style={{ fontSize: '0.75rem', lineHeight: 1.5 }}
        >
          Based on the 8 creators shortlisted in step 5.
        </div>
      </div>
      <div className="nd-stack" style={{ gap: 10 }}>
        <span className="nd-eyebrow">
          Shortlist · {builderShortlist.length}
        </span>
        {builderShortlist.map((s) => (
          <div className="nd-row" style={{ gap: 10 }} key={s.name}>
            <Avatar label={s.initials} size={30} />
            <span className="nd-grow" style={{ fontSize: '0.8rem' }}>
              {s.name}
            </span>
            <span className="nd-mono nd-ink2" style={{ fontSize: '0.75rem' }}>
              {s.rate}
            </span>
          </div>
        ))}
        <span
          className="nd-btn nd-btn--ghost nd-btn--sm"
          style={{ alignSelf: 'flex-start' }}
        >
          Edit shortlist →
        </span>
      </div>
    </aside>
  )
}

function PublishRail({
  total,
  checklist,
  onPublish,
  publishing,
  error,
  localError
}) {
  return (
    <aside className="cb__budget">
      <div className="nd-h3">Review before publishing</div>
      <div className="nd-stack" style={{ gap: 12 }}>
        {checklist.map((r) => (
          <div className="nd-row cb__review" style={{ gap: 10 }} key={r.label}>
            <span className={r.mark === 'ok' ? 'nd-ok' : 'nd-warn-mark'}>
              {r.mark === 'ok' ? '✓' : '!'}
            </span>
            <span className="nd-grow nd-stack" style={{ gap: 2 }}>
              <span className="nd-h3" style={{ fontSize: '0.82rem' }}>
                {r.label}
              </span>
              <span className="nd-muted" style={{ fontSize: '0.72rem' }}>
                {r.detail}
              </span>
            </span>
            <button className="nd-btn nd-btn--ghost nd-btn--sm">Edit</button>
          </div>
        ))}
      </div>
      <div className="cb__total">
        <span className="nd-h3" style={{ fontSize: '0.85rem' }}>
          Total to fund
        </span>
        <span
          className="nd-mono"
          style={{ fontSize: '1.35rem', fontWeight: 500 }}
        >
          {money(total)}
        </span>
      </div>
      <button
        className="nd-btn nd-btn--primary nd-btn--lg nd-btn--block"
        onClick={onPublish}
        disabled={publishing}
      >
        {publishing ? 'Publishing…' : 'Publish & fund escrow →'}
      </button>
      {(localError || error) && (
        <p className="nd-error">{localError || apiErrorMessage(error)}</p>
      )}
      <div
        className="nd-muted"
        style={{ fontSize: '0.72rem', lineHeight: 1.5 }}
      >
        Invites send once escrow clears. Unaccepted offers are refunded
        automatically.
      </div>
      <div className="cb__reach">
        <span className="nd-eyebrow">Projection</span>
        <div
          className="nd-mono"
          style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--accent-press)'
          }}
        >
          1.9M – 2.4M
        </div>
        <div
          className="nd-ink2"
          style={{ fontSize: '0.73rem', lineHeight: 1.5 }}
        >
          Estimated reach at a $19 blended CPM, assuming 6 of 8 creators accept.
        </div>
      </div>
    </aside>
  )
}
