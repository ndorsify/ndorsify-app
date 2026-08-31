import { useState } from 'react'
import { useSelector } from 'react-redux'

import '../campaigns/campaigns.css'
import AppNav from '../../components/common/AppNav'
import { selectUser } from '../auth/authSlice'
import { splitList } from '../profile/helpers'
import {
  useMarkLiveMutation,
  useMyCollaborationsQuery,
  useReviewDeliverableMutation,
  useSubmitDeliverableMutation
} from './collaborationApi'

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

function CollaborationCard({ collaboration, isBrand, isCreator }) {
  const c = collaboration
  return (
    <div className="nd-card" style={{ marginBottom: 14 }}>
      <div className="nd-row" style={{ gap: 8 }}>
        <span className="nd-h2">Campaign #{c.campaign_id}</span>
        <span className={`badge ${c.status}`}>
          {c.status.replace('_', ' ')}
        </span>
      </div>
      <div className="nd-muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>
        {isBrand ? `Creator #${c.creator_id}` : `Brand #${c.brand_id}`} ·{' '}
        {c.deliverables.length} deliverable
        {c.deliverables.length === 1 ? '' : 's'}
      </div>
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
