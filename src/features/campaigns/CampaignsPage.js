import { useState } from 'react'

import './campaigns.css'
import '../profile/profile.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import { apiErrorMessage } from '../../lib/errors'
import {
  useCloseCampaignMutation,
  useCreateCampaignMutation,
  useDecideApplicationMutation,
  useInviteMutation,
  useListApplicationsQuery,
  useMyCampaignsQuery,
  usePublishCampaignMutation
} from './campaignApi'

const ORANGE = '#FF914D'

function Applications({ campaignId }) {
  const { data: apps = [], isLoading } = useListApplicationsQuery(campaignId)
  const [decide] = useDecideApplicationMutation()
  if (isLoading) return <p className="muted">Loading applications…</p>
  if (apps.length === 0) return <p className="muted">No applications yet.</p>
  return (
    <div>
      {apps.map((a) => (
        <div className="app-row" key={a.id}>
          <span>
            Creator #{a.creator_id} · rate {a.proposed_rate ?? '—'}{' '}
            <span className={`badge ${a.status}`}>{a.status}</span>
          </span>
          {a.status === 'submitted' && (
            <span style={{ display: 'flex', gap: 6 }}>
              <Button type="button" color={ORANGE} primary size="small" label="Accept"
                onClick={() => decide({ applicationId: a.id, decision: 'accepted' })} />
              <Button type="button" color="#b23b3b" size="small" label="Reject"
                onClick={() => decide({ applicationId: a.id, decision: 'rejected' })} />
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function CampaignRow({ campaign }) {
  const [publish] = usePublishCampaignMutation()
  const [close] = useCloseCampaignMutation()
  const [invite, { error: inviteError, isSuccess: invited }] = useInviteMutation()
  const [open, setOpen] = useState(false)
  const [creatorId, setCreatorId] = useState('')

  const onInvite = async (e) => {
    e.preventDefault()
    const id = parseInt(creatorId, 10)
    if (!id) return
    try {
      await invite({ campaignId: campaign.id, creatorId: id }).unwrap()
      setCreatorId('')
    } catch {
      /* rendered below */
    }
  }

  return (
    <div className="campaign-card">
      <h3>
        {campaign.title} <span className={`badge ${campaign.status}`}>{campaign.status}</span>
      </h3>
      <div className="meta">
        {campaign.budget_amount ? `${campaign.budget_amount} ${campaign.budget_currency || ''}` : 'No budget'}
        {campaign.starts_on ? ` · ${campaign.starts_on} → ${campaign.ends_on || '?'}` : ''}
      </div>

      <div className="row-actions">
        {campaign.status === 'draft' && (
          <Button type="button" color={ORANGE} primary size="small" label="Publish"
            onClick={() => publish(campaign.id)} />
        )}
        {campaign.status === 'open' && (
          <Button type="button" color="#b23b3b" size="small" label="Close"
            onClick={() => close(campaign.id)} />
        )}
        <Button type="button" color={ORANGE} primary={false} size="small"
          label={open ? 'Hide details' : 'Manage'} onClick={() => setOpen(!open)} />
      </div>

      {open && (
        <div className="sub-panel">
          <strong>Applications</strong>
          <Applications campaignId={campaign.id} />

          <div style={{ marginTop: 12 }}>
            <strong>Invite a creator</strong>
            <form className="inline-form" onSubmit={onInvite}>
              <input placeholder="creator user id" type="number" value={creatorId}
                onChange={(e) => setCreatorId(e.target.value)} />
              <Button type="submit" color={ORANGE} primary size="small" label="Invite" />
            </form>
            {inviteError && <p className="form-error">{apiErrorMessage(inviteError)}</p>}
            {invited && !inviteError && <p className="form-ok">Invitation sent.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

const emptyForm = {
  title: '', objective: '', budget_amount: '', budget_currency: 'USD',
  starts_on: '', ends_on: '', platform: 'instagram', type: 'post', quantity: '1'
}

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading } = useMyCampaignsQuery()
  const [create, { isLoading: creating, error }] = useCreateCampaignMutation()
  const [form, setForm] = useState(emptyForm)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onCreate = async (e) => {
    e.preventDefault()
    try {
      await create({
        title: form.title,
        objective: form.objective,
        budget_amount: form.budget_amount ? Number(form.budget_amount) : null,
        budget_currency: form.budget_currency,
        starts_on: form.starts_on || null,
        ends_on: form.ends_on || null,
        platforms: [form.platform],
        deliverables: [
          { platform: form.platform, type: form.type, quantity: Number(form.quantity) || 1 }
        ]
      }).unwrap()
      setForm(emptyForm)
    } catch {
      /* rendered below */
    }
  }

  return (
    <>
      <AppNav />
      <div className="page">
        <h1>Your campaigns</h1>
        <p className="subtle">Create a brief, publish it, and review applications.</p>

        <form className="campaign-form" onSubmit={onCreate}>
          <input className="full" placeholder="Campaign title" value={form.title} onChange={set('title')} />
          <textarea className="full" placeholder="Objective" value={form.objective} onChange={set('objective')} />
          <input placeholder="Budget amount" type="number" value={form.budget_amount} onChange={set('budget_amount')} />
          <input placeholder="Currency" value={form.budget_currency} onChange={set('budget_currency')} />
          <input placeholder="Starts on (YYYY-MM-DD)" value={form.starts_on} onChange={set('starts_on')} />
          <input placeholder="Ends on (YYYY-MM-DD)" value={form.ends_on} onChange={set('ends_on')} />
          <input placeholder="Platform" value={form.platform} onChange={set('platform')} />
          <input placeholder="Deliverable type" value={form.type} onChange={set('type')} />
          <input placeholder="Quantity" type="number" value={form.quantity} onChange={set('quantity')} />
          <div className="full">
            {error && <p className="form-error">{apiErrorMessage(error)}</p>}
            <Button type="submit" color={ORANGE} primary size="large"
              label={creating ? 'Creating…' : 'Create draft'} />
          </div>
        </form>

        {isLoading && <p className="muted">Loading…</p>}
        {!isLoading && campaigns.length === 0 && <p className="muted">No campaigns yet.</p>}
        {campaigns.map((c) => (
          <CampaignRow campaign={c} key={c.id} />
        ))}
      </div>
    </>
  )
}
