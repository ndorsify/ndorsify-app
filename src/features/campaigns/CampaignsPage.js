import { useState } from 'react'
import { Link } from 'react-router-dom'

import './campaigns.css'
import AppNav from '../../components/common/AppNav'
import { SampleBanner } from '../../components/common/ds'
import { PAGE_ROUTES } from '../../routes'
import { apiErrorMessage } from '../../lib/errors'
import {
  useCloseCampaignMutation,
  useDecideApplicationMutation,
  useInviteMutation,
  useListApplicationsQuery,
  useMyCampaignsQuery,
  usePublishCampaignMutation
} from './campaignApi'
import { brandCampaigns } from '../../lib/sampleData'

function Applications({ campaignId }) {
  const { data: apps = [], isLoading } = useListApplicationsQuery(campaignId)
  const [decide] = useDecideApplicationMutation()
  if (isLoading)
    return (
      <p className="nd-muted" style={{ fontSize: '0.82rem' }}>
        Loading applications…
      </p>
    )
  if (apps.length === 0)
    return (
      <p className="nd-muted" style={{ fontSize: '0.82rem' }}>
        No applications yet.
      </p>
    )
  return (
    <div className="nd-stack" style={{ gap: 8 }}>
      {apps.map((a) => (
        <div className="nd-between app-row" key={a.id}>
          <span style={{ fontSize: '0.85rem' }}>
            Creator #{a.creator_id} · rate {a.proposed_rate ?? '—'}{' '}
            <span className={`badge ${a.status}`}>{a.status}</span>
          </span>
          {a.status === 'submitted' && (
            <span className="nd-row" style={{ gap: 6 }}>
              <button
                className="nd-btn nd-btn--primary nd-btn--sm"
                onClick={() =>
                  decide({ applicationId: a.id, decision: 'accepted' })
                }
              >
                Accept
              </button>
              <button
                className="nd-btn nd-btn--danger nd-btn--sm"
                onClick={() =>
                  decide({ applicationId: a.id, decision: 'rejected' })
                }
              >
                Reject
              </button>
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
  const [invite, { error: inviteError, isSuccess: invited }] =
    useInviteMutation()
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
    <div className="nd-card" style={{ marginBottom: 14 }}>
      <div className="nd-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="nd-row" style={{ gap: 8 }}>
            <span className="nd-h2">{campaign.title}</span>
            <span className={`badge ${campaign.status}`}>
              {campaign.status}
            </span>
          </div>
          <div
            className="nd-muted"
            style={{ fontSize: '0.8rem', marginTop: 4 }}
          >
            {campaign.budget_amount
              ? `${campaign.budget_amount} ${campaign.budget_currency || ''}`
              : 'No budget'}
            {campaign.starts_on
              ? ` · ${campaign.starts_on} → ${campaign.ends_on || '?'}`
              : ''}
          </div>
        </div>
        <div className="nd-row" style={{ gap: 8 }}>
          {campaign.status === 'draft' && (
            <button
              className="nd-btn nd-btn--primary nd-btn--sm"
              onClick={() => publish(campaign.id)}
            >
              Publish
            </button>
          )}
          {campaign.status === 'open' && (
            <button
              className="nd-btn nd-btn--danger nd-btn--sm"
              onClick={() => close(campaign.id)}
            >
              Close
            </button>
          )}
          <button
            className="nd-btn nd-btn--secondary nd-btn--sm"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Hide details' : 'Manage'}
          </button>
        </div>
      </div>

      {open && (
        <div className="sub-panel">
          <div className="nd-h3" style={{ marginBottom: 8 }}>
            Applications
          </div>
          <Applications campaignId={campaign.id} />
          <div style={{ marginTop: 14 }}>
            <div className="nd-h3" style={{ marginBottom: 8 }}>
              Invite a creator
            </div>
            <form className="nd-row" style={{ gap: 8 }} onSubmit={onInvite}>
              <input
                className="nd-input"
                style={{ maxWidth: 220 }}
                placeholder="creator user id"
                type="number"
                value={creatorId}
                onChange={(e) => setCreatorId(e.target.value)}
              />
              <button
                className="nd-btn nd-btn--primary nd-btn--sm"
                type="submit"
              >
                Invite
              </button>
            </form>
            {inviteError && (
              <p className="nd-error">{apiErrorMessage(inviteError)}</p>
            )}
            {invited && !inviteError && (
              <p className="nd-ok">Invitation sent.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading } = useMyCampaignsQuery()
  const usingSample = !isLoading && campaigns.length === 0

  return (
    <>
      <AppNav />
      <div className="nd-page">
        <div className="nd-page-head">
          <div className="nd-page-head__titles">
            <h1 className="nd-h1">Your campaigns</h1>
            <p className="nd-sub">
              Create a brief, publish it, and review applications.
            </p>
          </div>
          <Link
            to={PAGE_ROUTES.CAMPAIGN_NEW}
            className="nd-btn nd-btn--primary"
          >
            New campaign
          </Link>
        </div>

        {isLoading && <div className="nd-empty">Loading…</div>}

        {usingSample ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <SampleBanner>
                No campaigns yet — here's how live ones will look. Start with
                “New campaign”.
              </SampleBanner>
            </div>
            {brandCampaigns.map((c) => (
              <div
                className="nd-card"
                style={{ marginBottom: 14 }}
                key={c.name}
              >
                <div
                  className="nd-between"
                  style={{ alignItems: 'flex-start' }}
                >
                  <div>
                    <div className="nd-row" style={{ gap: 8 }}>
                      <span className="nd-h2">{c.name}</span>
                      <span className="nd-pill nd-pill--outline">
                        {c.status}
                      </span>
                    </div>
                    <div
                      className="nd-muted"
                      style={{ fontSize: '0.8rem', marginTop: 4 }}
                    >
                      {c.window} · {c.spend}
                    </div>
                  </div>
                  <span
                    className="nd-mono nd-ink2"
                    style={{ fontSize: '0.82rem' }}
                  >
                    reach {c.reach}
                  </span>
                </div>
              </div>
            ))}
          </>
        ) : (
          campaigns.map((c) => <CampaignRow campaign={c} key={c.id} />)
        )}
      </div>
    </>
  )
}
