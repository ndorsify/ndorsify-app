import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import './campaignBuilder.css'
import AppNav from '../../components/common/AppNav'
import { Avatar, Toggle } from '../../components/common/ds'
import { PAGE_ROUTES, buildPath } from '../../routes'
import { apiErrorMessage } from '../../lib/errors'
import { money } from '../../lib/format'
import { compact, toCreatorCard } from '../../lib/creatorFilters'
import {
  useCreateCampaignMutation,
  useInviteMutation,
  usePublishCampaignMutation
} from './campaignApi'
import { useLazySearchCreatorsQuery } from '../discovery/discoveryApi'
import { selectIsAuthed } from '../auth/authSlice'
import { builderSteps } from '../../lib/sampleData'

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

// discovery-service uses a differently-cased platform vocabulary than the
// campaign-service enum above — this bridges the two for the "use audience
// filters" search prefill in the Shortlist step.
const CAMPAIGN_TO_DISCOVERY_PLATFORM = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'X'
}

// Real niches from discovery-service's seed catalog — a starting quick-pick
// list; brands can also add their own via free text.
const NICHE_SUGGESTIONS = [
  'Skincare',
  'Clean beauty',
  'K-beauty',
  'Derm science',
  "Men's grooming",
  'SPF & sun care',
  'Barrier repair',
  'Fragrance-free',
  'Minimal skincare'
]

const blankDeliverable = () => ({
  id: Date.now(),
  platform: DEFAULT_PLATFORM,
  type: 'New deliverable',
  spec: 'Describe the deliverable',
  qty: 1,
  rate: 500
})

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

const addDays = (iso, days) => {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const REVIEW_DAYS = { '24h': 1, '48h': 2, '72h': 3 }
const GANTT_LIVE_SPAN_DAYS = 14 // cosmetic display window only, not sent anywhere

// Real schedule bars + tick labels derived from the dates actually picked,
// expressed as percentage offsets of the full displayed window.
function computeSchedule(startsOn, endsOn, reviewWindow) {
  if (!startsOn || !endsOn) return null
  const start = new Date(startsOn + 'T00:00:00')
  const end = new Date(endsOn + 'T00:00:00')
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
  const reviewDays = REVIEW_DAYS[reviewWindow] || 2
  const liveStart = addDays(endsOn, reviewDays)
  const windowEnd = addDays(liveStart, GANTT_LIVE_SPAN_DAYS)
  const totalMs = new Date(windowEnd + 'T00:00:00') - start
  if (totalMs <= 0) return null
  const pct = (fromIso, toIso) => {
    const from = new Date(fromIso + 'T00:00:00') - start
    const to = new Date(toIso + 'T00:00:00') - start
    return {
      startPct: Math.max(0, (from / totalMs) * 100),
      widthPct: Math.max(2, ((to - from) / totalMs) * 100)
    }
  }
  const bars = [
    {
      name: 'Content window',
      label: `${shortDate(startsOn)} – ${shortDate(endsOn)}`,
      tone: 'accent',
      ...pct(startsOn, endsOn)
    },
    {
      name: 'Review',
      label: `${shortDate(endsOn)} – ${shortDate(liveStart)}`,
      tone: 'warn',
      ...pct(endsOn, liveStart)
    },
    {
      name: 'Live',
      label: `From ${shortDate(liveStart)}`,
      tone: 'success',
      ...pct(liveStart, windowEnd)
    }
  ]
  const ticks = Array.from({ length: 5 }, (_, i) =>
    shortDate(addDays(startsOn, Math.round((totalMs / 86400000 / 4) * i)))
  )
  return { bars, ticks }
}

export default function CampaignBuilderPage() {
  const navigate = useNavigate()
  const [create, { isLoading: creating, error: createError }] =
    useCreateCampaignMutation()
  const [publish, { isLoading: publishing, error: publishError }] =
    usePublishCampaignMutation()
  const [invite] = useInviteMutation()
  const isLoading = creating || publishing
  const error = createError || publishError
  // An authed session (access OR persisted refresh token) means a real backend
  // session — gate on refresh too, so a page reload mid-builder (which clears
  // the in-memory access token) still hits the API: the reauth base query
  // silently exchanges the refresh token on the first 401. Without a token of
  // either kind we're in sample-data mode and skip the API so the flow stays
  // walkable.
  const liveSession = useSelector(selectIsAuthed)

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [objective, setObjective] = useState('')
  const [startsOn, setStartsOn] = useState(isoInDays(7))
  const [endsOn, setEndsOn] = useState(isoInDays(37))
  const [deliverables, setDeliverables] = useState(() => [blankDeliverable()])
  const [usage, setUsage] = useState('Organic only')
  const [approval, setApproval] = useState(true)
  const [reviewWindow, setReviewWindow] = useState('48h')
  const [exclusivity, setExclusivity] = useState(false)
  const [message, setMessage] = useState('')

  // Audience targeting (step 2) — target_audience has no backend schema, so
  // this shape is free; deliberately mirrors discoveryApi's search params so
  // it can prefill the Shortlist step's creator search.
  const [audienceNiches, setAudienceNiches] = useState([])
  const [audiencePlatforms, setAudiencePlatforms] = useState([])
  const [followerMin, setFollowerMin] = useState('')
  const [followerMax, setFollowerMax] = useState('')
  const [audienceLocations, setAudienceLocations] = useState([])
  const [minEngagement, setMinEngagement] = useState('')
  const [audienceNotes, setAudienceNotes] = useState('')

  // Shortlist (step 5) — real creators selected via discovery search.
  const [selectedCreators, setSelectedCreators] = useState([])

  const setField = (id, key, value) =>
    setDeliverables((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    )
  const removeRow = (id) =>
    setDeliverables((rows) => rows.filter((r) => r.id !== id))
  const addRow = () => setDeliverables((rows) => [...rows, blankDeliverable()])

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

  const deliverablesSummary = deliverables
    .map((d) => `${d.qty} × ${d.type}`)
    .join(', ')

  const reviewChecklist = [
    {
      mark: deliverables.length > 0 ? 'ok' : 'warn',
      label: 'Deliverables',
      detail: deliverablesSummary || 'No deliverables yet'
    },
    { mark: 'ok', label: 'Budget', detail: `${money(total)} total incl. fees` },
    {
      mark: objective.trim() && startsOn && endsOn ? 'ok' : 'warn',
      label: 'Timeline',
      detail: `${shortDate(startsOn)} – ${shortDate(endsOn)}`
    },
    { mark: 'warn', label: 'Usage rights', detail: usage }
  ]

  // Sidebar step states derive from the active step (step is 1–5, 1-based).
  const stepState = (i) => {
    if (i < step - 1) return 'done'
    if (i === step - 1) return 'current'
    return 'todo'
  }

  const [localError, setLocalError] = useState('')
  const [publishResult, setPublishResult] = useState(null)

  // Create the draft, publish it, then best-effort invite every shortlisted
  // creator. Publish is never rolled back by an invite failure — invites have
  // no status gate on the backend, so this ordering is safe either way.
  const createAndPublish = async () => {
    const created = await create({
      title,
      objective,
      platforms: [...new Set(deliverables.map((d) => d.platform))],
      deliverables: deliverables.map((d) => ({
        platform: d.platform,
        type: d.type,
        quantity: d.qty,
        usage,
        requires_approval: approval
      })),
      budget_amount: total,
      budget_currency: 'USD',
      starts_on: startsOn,
      ends_on: endsOn,
      target_audience: {
        niches: audienceNiches,
        platforms: audiencePlatforms,
        follower_range: {
          min: followerMin ? Number(followerMin) : null,
          max: followerMax ? Number(followerMax) : null
        },
        locations: audienceLocations,
        min_engagement: minEngagement ? Number(minEngagement) : null,
        notes: audienceNotes
      }
    }).unwrap()
    await publish(created.id).unwrap()

    const results = await Promise.allSettled(
      selectedCreators.map((c) =>
        invite({ campaignId: created.id, creatorId: c.id, message }).unwrap()
      )
    )
    const sent = results.filter((r) => r.status === 'fulfilled').length
    return {
      id: created.id,
      sent,
      failed: results.length - sent,
      total: results.length
    }
  }

  const onPublish = async () => {
    setLocalError('')
    setPublishResult(null)
    if (!title.trim()) {
      setLocalError('Add a campaign title before publishing.')
      return setStep(1)
    }
    // Publish requires an objective, a valid timeline, at least one
    // deliverable, and a non-zero budget; guard client-side so the brand
    // lands back on the step that's missing rather than a raw 422.
    if (!objective.trim() || !startsOn || !endsOn) {
      setLocalError('Add an objective and a start/end date before publishing.')
      return setStep(4)
    }
    if (endsOn < startsOn) {
      setLocalError('The end date must be on or after the start date.')
      return setStep(4)
    }
    if (deliverables.length === 0) {
      setLocalError('Add at least one deliverable before publishing.')
      return setStep(3)
    }
    if (total <= 0) {
      setLocalError(
        'Set a rate greater than $0 for at least one deliverable before publishing.'
      )
      return setStep(3)
    }
    if (!liveSession) {
      // Sample-data mode: keep the flow walkable without a backend.
      return navigate(buildPath(PAGE_ROUTES.CAMPAIGN_FUND, { id: '1' }))
    }
    try {
      const result = await createAndPublish()
      if (result.failed === 0) {
        navigate(
          buildPath(PAGE_ROUTES.CAMPAIGN_FUND, { id: String(result.id) })
        )
      } else {
        // Some invites failed (most likely already-invited 409s) — publish
        // itself succeeded, so don't silently swallow the partial failure by
        // auto-navigating; let the brand see the count and continue manually.
        setPublishResult(result)
      }
    } catch {
      /* rendered inline via `error`; stay on the page */
    }
  }

  const inviteCount = selectedCreators.length

  const primary = {
    1: { label: 'Continue → Audience', onClick: () => setStep(2) },
    2: { label: 'Continue → Deliverables', onClick: () => setStep(3) },
    3: { label: 'Continue → Timeline', onClick: () => setStep(4) },
    4: { label: 'Continue → Shortlist', onClick: () => setStep(5) },
    5: {
      label: isLoading
        ? 'Publishing…'
        : inviteCount > 0
        ? `Publish & send ${inviteCount} invite${inviteCount === 1 ? '' : 's'}`
        : 'Publish campaign',
      onClick: onPublish
    }
  }[step]

  const pillText = {
    1: 'Draft · step 1 of 5',
    2: 'Draft · step 2 of 5',
    3: 'Draft · step 3 of 5',
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
              placeholder="Untitled campaign"
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
            {step > 1 && (
              <button
                className="nd-btn nd-btn--secondary nd-btn--sm"
                onClick={() => setStep((s) => s - 1)}
              >
                ← {builderSteps[step - 2].title}
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
            {step === 1 && (
              <BasicsStep
                title={title}
                setTitle={setTitle}
                objective={objective}
                setObjective={setObjective}
                error={error}
                localError={localError}
              />
            )}
            {step === 2 && (
              <AudienceStep
                niches={audienceNiches}
                setNiches={setAudienceNiches}
                platforms={audiencePlatforms}
                setPlatforms={setAudiencePlatforms}
                followerMin={followerMin}
                setFollowerMin={setFollowerMin}
                followerMax={followerMax}
                setFollowerMax={setFollowerMax}
                locations={audienceLocations}
                setLocations={setAudienceLocations}
                minEngagement={minEngagement}
                setMinEngagement={setMinEngagement}
                notes={audienceNotes}
                setNotes={setAudienceNotes}
              />
            )}
            {step === 3 && (
              <DeliverablesStep
                deliverables={deliverables}
                setField={setField}
                removeRow={removeRow}
                addRow={addRow}
                usage={usage}
                setUsage={setUsage}
                approval={approval}
                setApproval={setApproval}
                error={error}
                localError={localError}
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
                exclusivity={exclusivity}
                setExclusivity={setExclusivity}
                error={error}
                localError={localError}
              />
            )}
            {step === 5 && (
              <ShortlistStep
                message={message}
                setMessage={setMessage}
                selectedCreators={selectedCreators}
                setSelectedCreators={setSelectedCreators}
                audienceNiches={audienceNiches}
                audiencePlatforms={audiencePlatforms}
                followerMin={followerMin}
                followerMax={followerMax}
                publishResult={publishResult}
                onContinueToFund={() =>
                  navigate(
                    buildPath(PAGE_ROUTES.CAMPAIGN_FUND, {
                      id: String(publishResult.id)
                    })
                  )
                }
              />
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
              selectedCreators={selectedCreators}
            />
          ) : (
            <BudgetRail
              budgetLines={budgetLines}
              total={total}
              selectedCreators={selectedCreators}
            />
          )}
        </div>
      </div>
    </>
  )
}

function BasicsStep({
  title,
  setTitle,
  objective,
  setObjective,
  error,
  localError
}) {
  return (
    <>
      <div className="nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Step 1 · Basics</span>
        <h1 className="nd-h1" style={{ fontSize: '1.75rem' }}>
          Name the campaign and set the goal
        </h1>
        <div className="nd-ink2" style={{ fontSize: '0.88rem', maxWidth: 560 }}>
          This is what creators and your team will see first.
        </div>
      </div>

      <div className="nd-card nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Campaign title</span>
        <input
          className="nd-input"
          placeholder="e.g. Spring product launch"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="nd-card nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Campaign objective</span>
        <textarea
          className="nd-textarea"
          rows={3}
          placeholder="What is this campaign trying to achieve?"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />
        <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
          Shown to creators in the marketplace listing. Required to publish.
        </div>
      </div>

      {(localError || error) && (
        <p className="nd-error">{localError || apiErrorMessage(error)}</p>
      )}
    </>
  )
}

function TagPicker({ label, suggestions, values, setValues, placeholder }) {
  const [draft, setDraft] = useState('')
  const toggle = (v) =>
    setValues((rows) =>
      rows.includes(v) ? rows.filter((r) => r !== v) : [...rows, v]
    )
  const addCustom = () => {
    const v = draft.trim()
    if (v && !values.includes(v)) setValues((rows) => [...rows, v])
    setDraft('')
  }
  return (
    <div className="nd-card nd-card--tight nd-stack" style={{ gap: 10 }}>
      <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
        {label}
      </div>
      {suggestions && (
        <div className="nd-row nd-wrap" style={{ gap: 8 }}>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className={values.includes(s) ? 'cb__chip is-on' : 'cb__chip'}
              onClick={() => toggle(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {values.filter((v) => !suggestions?.includes(v)).length > 0 && (
        <div className="nd-row nd-wrap" style={{ gap: 8 }}>
          {values
            .filter((v) => !suggestions?.includes(v))
            .map((v) => (
              <span key={v} className="nd-pill nd-pill--outline">
                {v}{' '}
                <button
                  type="button"
                  onClick={() => toggle(v)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    marginLeft: 4
                  }}
                  aria-label={`Remove ${v}`}
                >
                  ✕
                </button>
              </span>
            ))}
        </div>
      )}
      <div className="nd-row" style={{ gap: 8 }}>
        <input
          className="nd-input nd-grow"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
        />
        <button type="button" className="nd-add" onClick={addCustom}>
          + Add
        </button>
      </div>
    </div>
  )
}

function AudienceStep({
  niches,
  setNiches,
  platforms,
  setPlatforms,
  followerMin,
  setFollowerMin,
  followerMax,
  setFollowerMax,
  locations,
  setLocations,
  minEngagement,
  setMinEngagement,
  notes,
  setNotes
}) {
  const togglePlatform = (v) =>
    setPlatforms((rows) =>
      rows.includes(v) ? rows.filter((r) => r !== v) : [...rows, v]
    )
  return (
    <>
      <div className="nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Step 2 · Audience</span>
        <h1 className="nd-h1" style={{ fontSize: '1.75rem' }}>
          Who do you want to reach?
        </h1>
        <div className="nd-ink2" style={{ fontSize: '0.88rem', maxWidth: 560 }}>
          Optional — helps you find matching creators faster in the Shortlist
          step. Nothing here blocks publishing.
        </div>
      </div>

      <TagPicker
        label="Niches"
        suggestions={NICHE_SUGGESTIONS}
        values={niches}
        setValues={setNiches}
        placeholder="Add a custom niche"
      />

      <div className="nd-card nd-card--tight nd-stack" style={{ gap: 10 }}>
        <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
          Platforms
        </div>
        <div className="nd-row nd-wrap" style={{ gap: 8 }}>
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              type="button"
              className={
                platforms.includes(p.value) ? 'cb__chip is-on' : 'cb__chip'
              }
              onClick={() => togglePlatform(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cb__opts">
        <div className="nd-card nd-card--tight nd-stack" style={{ gap: 9 }}>
          <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
            Follower range
          </div>
          <div className="nd-row" style={{ gap: 8 }}>
            <input
              className="nd-input"
              type="number"
              min="0"
              placeholder="Min"
              value={followerMin}
              onChange={(e) => setFollowerMin(e.target.value)}
            />
            <input
              className="nd-input"
              type="number"
              min="0"
              placeholder="Max"
              value={followerMax}
              onChange={(e) => setFollowerMax(e.target.value)}
            />
          </div>
        </div>
        <div className="nd-card nd-card--tight nd-stack" style={{ gap: 9 }}>
          <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
            Min. engagement rate
          </div>
          <input
            className="nd-input"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 3.5"
            value={minEngagement}
            onChange={(e) => setMinEngagement(e.target.value)}
          />
        </div>
      </div>

      <TagPicker
        label="Locations"
        values={locations}
        setValues={setLocations}
        placeholder="e.g. Lagos, NG"
      />

      <div className="nd-card nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Notes</span>
        <textarea
          className="nd-textarea"
          rows={2}
          placeholder="Anything else about who you're trying to reach"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </>
  )
}

function DeliverablesStep({
  deliverables,
  setField,
  removeRow,
  addRow,
  usage,
  setUsage,
  approval,
  setApproval,
  error,
  localError
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
      {(localError || error) && (
        <p className="nd-error">{localError || apiErrorMessage(error)}</p>
      )}
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
  const schedule = computeSchedule(startsOn, endsOn, reviewWindow)
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
        {!schedule ? (
          <p className="nd-muted" style={{ fontSize: '0.82rem' }}>
            Pick a start and end date to preview the schedule.
          </p>
        ) : (
          <>
            <div className="cb__gantt-scale">
              {schedule.ticks.map((t, i) => (
                <span key={`${t}-${i}`} className="nd-mono">
                  {t}
                </span>
              ))}
            </div>
            <div className="cb__gantt">
              {schedule.bars.map((g) => (
                <div className="cb__gantt-row" key={g.name}>
                  <span className="cb__gantt-name">{g.name}</span>
                  <span className="cb__gantt-track">
                    <span
                      className={`cb__gantt-bar cb__gantt-bar--${g.tone}`}
                      style={{
                        left: `${g.startPct}%`,
                        width: `${g.widthPct}%`
                      }}
                    >
                      {g.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
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

function ShortlistStep({
  message,
  setMessage,
  selectedCreators,
  setSelectedCreators,
  audienceNiches,
  audiencePlatforms,
  followerMin,
  followerMax,
  publishResult,
  onContinueToFund
}) {
  const [query, setQuery] = useState('')
  const [searchPlatforms, setSearchPlatforms] = useState([])
  const [runSearch, { data: results, isFetching }] =
    useLazySearchCreatorsQuery()

  const search = (params) => runSearch(params)

  const useAudienceFilters = () => {
    const mappedPlatforms = audiencePlatforms
      .map((p) => CAMPAIGN_TO_DISCOVERY_PLATFORM[p])
      .filter(Boolean)
    setSearchPlatforms(mappedPlatforms)
    setQuery('')
    search({
      sort: 'followers',
      niche: audienceNiches,
      ...(mappedPlatforms.length ? { platform: mappedPlatforms } : {}),
      ...(followerMin ? { min_followers: Number(followerMin) } : {}),
      ...(followerMax ? { max_followers: Number(followerMax) } : {})
    })
  }

  const onSearchSubmit = (e) => {
    e.preventDefault()
    search({
      sort: 'followers',
      q: query,
      ...(searchPlatforms.length ? { platform: searchPlatforms } : {})
    })
  }

  const cards = Array.isArray(results) ? results.map(toCreatorCard) : []
  const selectedIds = new Set(selectedCreators.map((c) => c.id))
  const toggleSelect = (card) => {
    setSelectedCreators((rows) =>
      selectedIds.has(card.id)
        ? rows.filter((r) => r.id !== card.id)
        : [...rows, card]
    )
  }

  return (
    <>
      <div className="nd-stack" style={{ gap: 8 }}>
        <span className="nd-eyebrow">Step 5 · Shortlist</span>
        <h1 className="nd-h1" style={{ fontSize: '1.75rem' }}>
          {selectedCreators.length} creator
          {selectedCreators.length === 1 ? '' : 's'} shortlisted
        </h1>
      </div>

      <div className="nd-card nd-stack" style={{ gap: 12 }}>
        <form
          className="nd-row nd-wrap"
          style={{ gap: 8 }}
          onSubmit={onSearchSubmit}
        >
          <input
            className="nd-input nd-grow"
            placeholder="Search creators, niches, keywords"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="nd-btn nd-btn--primary nd-btn--sm" type="submit">
            Search
          </button>
          <button
            type="button"
            className="nd-btn nd-btn--secondary nd-btn--sm"
            onClick={useAudienceFilters}
          >
            Use audience filters
          </button>
        </form>

        {isFetching && (
          <p className="nd-muted" style={{ fontSize: '0.82rem' }}>
            Searching…
          </p>
        )}
        {!isFetching && cards.length === 0 && (
          <p className="nd-muted" style={{ fontSize: '0.82rem' }}>
            Search to find creators to shortlist.
          </p>
        )}
        <div className="nd-stack" style={{ gap: 8 }}>
          {cards.map((c) => (
            <div
              className="nd-between"
              key={c.id}
              style={{
                padding: '10px 4px',
                borderBottom: '1px solid var(--canvas)'
              }}
            >
              <span className="nd-row" style={{ gap: 10 }}>
                <Avatar label={c.initials} size={30} />
                <span className="nd-stack" style={{ gap: 1 }}>
                  <span className="nd-h3" style={{ fontSize: '0.82rem' }}>
                    {c.name}
                  </span>
                  <span className="nd-muted" style={{ fontSize: '0.7rem' }}>
                    {c.niche} · {c.followers} followers
                  </span>
                </span>
              </span>
              <button
                className={
                  selectedIds.has(c.id)
                    ? 'nd-btn nd-btn--secondary nd-btn--sm'
                    : 'nd-btn nd-btn--primary nd-btn--sm'
                }
                onClick={() => toggleSelect(c)}
              >
                {selectedIds.has(c.id) ? 'Shortlisted ✓' : 'Shortlist'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCreators.length > 0 && (
        <div className="nd-card">
          <div
            className="nd-thead"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 32px',
              gap: 10
            }}
          >
            <span>Creator</span>
            <span>Reach est.</span>
            <span>Their rate</span>
            <span />
          </div>
          {selectedCreators.map((c) => (
            <div
              className="nd-trow"
              key={c.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 32px',
                gap: 10,
                alignItems: 'center'
              }}
            >
              <span className="nd-row" style={{ gap: 10 }}>
                <Avatar label={c.initials} size={26} />
                <span style={{ fontSize: '0.82rem' }}>{c.name}</span>
              </span>
              <span className="nd-mono" style={{ fontSize: '0.8rem' }}>
                {c.followers}
              </span>
              <span className="nd-mono nd-ink2" style={{ fontSize: '0.8rem' }}>
                {c.rate ? money(c.rate) : '—'}
              </span>
              <button
                className="cb__remove"
                aria-label="Remove"
                onClick={() =>
                  setSelectedCreators((rows) =>
                    rows.filter((r) => r.id !== c.id)
                  )
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="nd-card nd-stack" style={{ gap: 10 }}>
        <div className="nd-between">
          <div className="nd-h3">Invitation message</div>
          <span className="nd-eyebrow">Sent with each invite</span>
        </div>
        <textarea
          className="nd-textarea"
          rows={3}
          placeholder="Add a personal note for the creators you're inviting…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {publishResult && (
        <div className="nd-card nd-card--accent nd-stack" style={{ gap: 10 }}>
          <p style={{ fontSize: '0.86rem' }}>
            Published. {publishResult.sent} of {publishResult.total} invitations
            sent — {publishResult.failed} failed, most likely already invited.
          </p>
          <button
            className="nd-btn nd-btn--primary nd-btn--sm"
            style={{ alignSelf: 'flex-start' }}
            onClick={onContinueToFund}
          >
            Continue to funding →
          </button>
        </div>
      )}
    </>
  )
}

function BudgetRail({ budgetLines, total, selectedCreators }) {
  const combinedReach = selectedCreators.reduce(
    (sum, c) => sum + (c.followerCount || 0),
    0
  )
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
      {combinedReach > 0 && (
        <div className="cb__reach">
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--accent-press)'
            }}
          >
            Combined audience of {compact(combinedReach)}
          </div>
          <div
            className="nd-ink2"
            style={{ fontSize: '0.75rem', lineHeight: 1.5 }}
          >
            Sum of followers across your shortlisted creators.
          </div>
        </div>
      )}
      <div className="nd-stack" style={{ gap: 10 }}>
        <span className="nd-eyebrow">
          Shortlist · {selectedCreators.length}
        </span>
        {selectedCreators.length === 0 && (
          <p className="nd-muted" style={{ fontSize: '0.78rem' }}>
            No creators shortlisted yet — add some in step 5.
          </p>
        )}
        {selectedCreators.map((s) => (
          <div className="nd-row" style={{ gap: 10 }} key={s.id}>
            <Avatar label={s.initials} size={30} />
            <span className="nd-grow" style={{ fontSize: '0.8rem' }}>
              {s.name}
            </span>
            <span className="nd-mono nd-ink2" style={{ fontSize: '0.75rem' }}>
              {s.rate ? money(s.rate) : '—'}
            </span>
          </div>
        ))}
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
  localError,
  selectedCreators
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
      <button
        className="nd-btn nd-btn--primary nd-btn--lg nd-btn--block"
        onClick={onPublish}
        disabled={publishing}
      >
        {publishing
          ? 'Publishing…'
          : selectedCreators.length > 0
          ? `Publish & send ${selectedCreators.length} invite${
              selectedCreators.length === 1 ? '' : 's'
            }`
          : 'Publish campaign →'}
      </button>
      {(localError || error) && (
        <p className="nd-error">{localError || apiErrorMessage(error)}</p>
      )}
      <div
        className="nd-muted"
        style={{ fontSize: '0.72rem', lineHeight: 1.5 }}
      >
        Funding happens as a separate step after publishing.
      </div>
    </aside>
  )
}
