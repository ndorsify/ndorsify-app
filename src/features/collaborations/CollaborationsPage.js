import { useState } from 'react'
import { useSelector } from 'react-redux'

import '../campaigns/campaigns.css'
import AppNav from '../../components/common/AppNav'
import { selectUser } from '../auth/authSlice'
import { splitList } from '../profile/helpers'
import {
  useCollaborationTimelineQuery,
  useMarkLiveMutation,
  useMyCollaborationsQuery,
  useReviewDeliverableMutation,
  useSubmitDeliverableMutation
} from './collaborationApi'

const shortDateTime = (iso) => {
  const d = new Date(iso.endsWith('Z') ? iso : `${iso}Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const deliverableLabel = (deliverables, id) => {
  const d = deliverables.find((row) => row.id === id)
  return d ? `${d.platform || '—'} · ${d.type || '—'}` : `Deliverable #${id}`
}

function CreatorSubmit({ deliverableId }) {
  const [submit, { isLoading }] = useSubmitDeliverableMutation()
  const [files, setFiles] = useState('')
  const [note, setNote] = useState('')
  const onSubmit = (e) => {
    e.preventDefault()
    submit({ deliverableId, file_refs: splitList(files), note })
  }
  return (
    <form className="nd-row nd-wrap" style={{ gap: 8 }} onSubmit={onSubmit}>
      <input
        className="nd-input nd-grow"
        placeholder="File keys (comma)"
        value={files}
        onChange={(e) => setFiles(e.target.value)}
      />
      <input
        className="nd-input"
        style={{ maxWidth: 200 }}
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="nd-btn nd-btn--primary nd-btn--sm" type="submit">
        {isLoading ? '…' : 'Submit'}
      </button>
    </form>
  )
}

function BrandReview({ deliverableId }) {
  const [review, { isLoading }] = useReviewDeliverableMutation()
  const [feedback, setFeedback] = useState('')
  return (
    <div className="nd-row nd-wrap" style={{ gap: 8 }}>
      <button
        className="nd-btn nd-btn--primary nd-btn--sm"
        onClick={() => review({ deliverableId, decision: 'approved' })}
      >
        {isLoading ? '…' : 'Approve'}
      </button>
      <input
        className="nd-input nd-grow"
        placeholder="Change request feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button
        className="nd-btn nd-btn--danger nd-btn--sm"
        onClick={() =>
          review({ deliverableId, decision: 'changes_requested', feedback })
        }
      >
        Request changes
      </button>
    </div>
  )
}

function DeliverableRow({ deliverable, isBrand, isCreator }) {
  const [markLive] = useMarkLiveMutation()
  const d = deliverable
  return (
    <div
      className="nd-stack"
      style={{
        gap: 8,
        padding: '10px 0',
        borderBottom: '1px solid var(--canvas)'
      }}
    >
      <div className="nd-between">
        <span style={{ fontSize: '0.85rem' }}>
          {d.platform || '—'} · {d.type || '—'}{' '}
          {d.description ? `· ${d.description}` : ''}
        </span>
        <span className={`badge ${d.status}`}>
          {d.status.replace('_', ' ')}
        </span>
      </div>
      <div>
        {isCreator &&
          (d.status === 'todo' || d.status === 'changes_requested') && (
            <CreatorSubmit deliverableId={d.id} />
          )}
        {isBrand && d.status === 'submitted' && (
          <BrandReview deliverableId={d.id} />
        )}
        {isCreator && d.status === 'approved' && (
          <button
            className="nd-btn nd-btn--primary nd-btn--sm"
            onClick={() => markLive(d.id)}
          >
            Mark live
          </button>
        )}
      </div>
    </div>
  )
}

function TimelinePanel({ collaborationId, deliverables }) {
  const { data: events = [], isLoading } =
    useCollaborationTimelineQuery(collaborationId)

  if (isLoading) {
    return (
      <p className="nd-muted" style={{ fontSize: '0.82rem' }}>
        Loading timeline…
      </p>
    )
  }
  if (events.length === 0) {
    return (
      <p className="nd-muted" style={{ fontSize: '0.82rem' }}>
        No submissions or reviews yet.
      </p>
    )
  }
  return (
    <div className="nd-stack" style={{ gap: 10 }}>
      {events.map((e, i) => (
        <div
          className="nd-between"
          key={i}
          style={{ alignItems: 'flex-start', gap: 10 }}
        >
          <div className="nd-stack" style={{ gap: 2 }}>
            <span style={{ fontSize: '0.82rem' }}>
              {e.kind === 'submission'
                ? `Submitted v${e.detail.version}`
                : `Review: ${e.detail.decision.replace('_', ' ')}`}{' '}
              — {deliverableLabel(deliverables, e.deliverable_id)}
            </span>
            {e.kind === 'submission' && e.detail.note && (
              <span className="nd-muted" style={{ fontSize: '0.76rem' }}>
                “{e.detail.note}”
              </span>
            )}
            {e.kind === 'review' && e.detail.feedback && (
              <span className="nd-muted" style={{ fontSize: '0.76rem' }}>
                “{e.detail.feedback}”
              </span>
            )}
          </div>
          <span className="nd-muted" style={{ fontSize: '0.72rem' }}>
            {shortDateTime(e.at)}
          </span>
        </div>
      ))}
    </div>
  )
}

function CollaborationCard({ collaboration, isBrand, isCreator }) {
  const c = collaboration
  const [showTimeline, setShowTimeline] = useState(false)
  return (
    <div className="nd-card" style={{ marginBottom: 14 }}>
      <div className="nd-between">
        <div className="nd-row" style={{ gap: 8 }}>
          <span className="nd-h2">Campaign #{c.campaign_id}</span>
          <span className={`badge ${c.status}`}>
            {c.status.replace('_', ' ')}
          </span>
        </div>
        <button
          className="nd-btn nd-btn--ghost nd-btn--sm"
          onClick={() => setShowTimeline((v) => !v)}
        >
          {showTimeline ? 'Hide timeline' : 'View timeline'}
        </button>
      </div>
      <div className="nd-muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>
        {isBrand ? `Creator #${c.creator_id}` : `Brand #${c.brand_id}`} ·{' '}
        {c.deliverables.length} deliverable
        {c.deliverables.length === 1 ? '' : 's'}
      </div>
      {showTimeline && (
        <div className="sub-panel">
          <TimelinePanel collaborationId={c.id} deliverables={c.deliverables} />
        </div>
      )}
      <div className="sub-panel">
        {c.deliverables.map((d) => (
          <DeliverableRow
            key={d.id}
            deliverable={d}
            isBrand={isBrand}
            isCreator={isCreator}
          />
        ))}
      </div>
    </div>
  )
}

export default function CollaborationsPage() {
  const user = useSelector(selectUser)
  const isBrand = user?.role === 'brand'
  const isCreator = user?.role === 'creator'
  const { data: collaborations = [], isLoading } = useMyCollaborationsQuery()

  return (
    <>
      <AppNav />
      <div className="nd-page nd-page--narrow">
        <div className="nd-page-head">
          <div className="nd-page-head__titles">
            <h1 className="nd-h1">
              {isBrand ? 'Deliverables & reports' : 'My deals'}
            </h1>
            <p className="nd-sub">
              {isBrand
                ? 'Review deliverables from your creators.'
                : 'Submit your deliverables and take them live.'}
            </p>
          </div>
        </div>

        {isLoading && <div className="nd-empty">Loading…</div>}
        {!isLoading && collaborations.length === 0 && (
          <div className="nd-empty">
            No collaborations yet — they appear once a campaign match is
            accepted.
          </div>
        )}
        {collaborations.map((c) => (
          <CollaborationCard
            key={c.id}
            collaboration={c}
            isBrand={isBrand}
            isCreator={isCreator}
          />
        ))}
      </div>
    </>
  )
}
