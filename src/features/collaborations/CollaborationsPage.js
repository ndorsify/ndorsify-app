import { useState } from 'react'
import { useSelector } from 'react-redux'

import '../campaigns/campaigns.css'
import '../profile/profile.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import { selectUser } from '../auth/authSlice'
import { splitList } from '../profile/helpers'
import {
  useMarkLiveMutation,
  useMyCollaborationsQuery,
  useReviewDeliverableMutation,
  useSubmitDeliverableMutation
} from './collaborationApi'

const ORANGE = '#FF914D'

function CreatorSubmit({ deliverableId }) {
  const [submit, { isLoading }] = useSubmitDeliverableMutation()
  const [files, setFiles] = useState('')
  const [note, setNote] = useState('')
  const onSubmit = (e) => {
    e.preventDefault()
    submit({ deliverableId, file_refs: splitList(files), note })
  }
  return (
    <form className="inline-form" onSubmit={onSubmit}>
      <input placeholder="File keys (comma)" value={files} onChange={(e) => setFiles(e.target.value)} />
      <input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button type="submit" color={ORANGE} primary size="small" label={isLoading ? '…' : 'Submit'} />
    </form>
  )
}

function BrandReview({ deliverableId }) {
  const [review, { isLoading }] = useReviewDeliverableMutation()
  const [feedback, setFeedback] = useState('')
  return (
    <div className="inline-form">
      <Button type="button" color={ORANGE} primary size="small" label={isLoading ? '…' : 'Approve'}
        onClick={() => review({ deliverableId, decision: 'approved' })} />
      <input placeholder="Change request feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      <Button type="button" color="#b23b3b" size="small" label="Request changes"
        onClick={() => review({ deliverableId, decision: 'changes_requested', feedback })} />
    </div>
  )
}

function DeliverableRow({ deliverable, isBrand, isCreator }) {
  const [markLive] = useMarkLiveMutation()
  const d = deliverable
  return (
    <div className="app-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {d.platform || '—'} · {d.type || '—'} {d.description ? `· ${d.description}` : ''}
        </span>
        <span className={`badge ${d.status}`}>{d.status.replace('_', ' ')}</span>
      </div>
      <div style={{ marginTop: 6 }}>
        {isCreator && (d.status === 'todo' || d.status === 'changes_requested') && (
          <CreatorSubmit deliverableId={d.id} />
        )}
        {isBrand && d.status === 'submitted' && <BrandReview deliverableId={d.id} />}
        {isCreator && d.status === 'approved' && (
          <Button type="button" color={ORANGE} primary size="small" label="Mark live"
            onClick={() => markLive(d.id)} />
        )}
      </div>
    </div>
  )
}

function CollaborationCard({ collaboration, isBrand, isCreator }) {
  const c = collaboration
  return (
    <div className="campaign-card">
      <h3>
        Campaign #{c.campaign_id}{' '}
        <span className={`badge ${c.status}`}>{c.status.replace('_', ' ')}</span>
      </h3>
      <div className="meta">
        {isBrand ? `Creator #${c.creator_id}` : `Brand #${c.brand_id}`} ·{' '}
        {c.deliverables.length} deliverable{c.deliverables.length === 1 ? '' : 's'}
      </div>
      <div className="sub-panel">
        {c.deliverables.map((d) => (
          <DeliverableRow key={d.id} deliverable={d} isBrand={isBrand} isCreator={isCreator} />
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
      <div className="page">
        <h1>Collaborations</h1>
        <p className="subtle">
          {isBrand ? 'Review deliverables from your creators.' : 'Submit your deliverables and take them live.'}
        </p>

        {isLoading && <p className="muted">Loading…</p>}
        {!isLoading && collaborations.length === 0 && (
          <p className="muted">No collaborations yet — they appear once a campaign match is accepted.</p>
        )}
        {collaborations.map((c) => (
          <CollaborationCard key={c.id} collaboration={c} isBrand={isBrand} isCreator={isCreator} />
        ))}
      </div>
    </>
  )
}
