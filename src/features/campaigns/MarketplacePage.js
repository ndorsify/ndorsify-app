import { useEffect, useState } from 'react'

import './campaigns.css'
import AppNav from '../../components/common/AppNav'
import { SampleBanner } from '../../components/common/ds'
import { apiErrorMessage } from '../../lib/errors'
import { useApplyMutation, useLazyMarketplaceQuery } from './campaignApi'
import { sampleInvites } from '../../lib/sampleData'

function CampaignRow({ campaign }) {
  const [apply, { isSuccess, error, isLoading }] = useApplyMutation()
  const [open, setOpen] = useState(false)
  const [proposal, setProposal] = useState('')
  const [rate, setRate] = useState('')

  const onApply = async (e) => {
    e.preventDefault()
    try {
      await apply({
        campaignId: campaign.id,
        proposal,
        proposed_rate: rate ? Number(rate) : null
      }).unwrap()
    } catch {
      /* rendered below */
    }
  }

  return (
    <div className="nd-card" style={{ marginBottom: 14 }}>
      <div className="nd-between" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="nd-h2">{campaign.title}</div>
          <div
            className="nd-muted"
            style={{ fontSize: '0.8rem', marginTop: 4 }}
          >
            {campaign.objective || ''}
            {campaign.budget_amount
              ? ` · ${campaign.budget_amount} ${campaign.budget_currency || ''}`
              : ''}
            {(campaign.platforms || []).length
              ? ` · ${campaign.platforms.join(', ')}`
              : ''}
          </div>
        </div>
        <button
          className="nd-btn nd-btn--secondary nd-btn--sm"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Cancel' : 'Apply'}
        </button>
      </div>
      {open && (
        <div className="sub-panel">
          {isSuccess && !error ? (
            <p className="nd-ok">Application submitted.</p>
          ) : (
            <form
              className="nd-row nd-wrap"
              style={{ gap: 8 }}
              onSubmit={onApply}
            >
              <input
                className="nd-input nd-grow"
                placeholder="Your proposal"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
              />
              <input
                className="nd-input"
                style={{ maxWidth: 140 }}
                placeholder="Rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
              <button
                className="nd-btn nd-btn--primary nd-btn--sm"
                type="submit"
              >
                {isLoading ? '…' : 'Submit'}
              </button>
            </form>
          )}
          {error && <p className="nd-error">{apiErrorMessage(error)}</p>}
        </div>
      )}
    </div>
  )
}

export default function MarketplacePage() {
  const [runSearch, { data: campaigns = [], isFetching }] =
    useLazyMarketplaceQuery()
  const [q, setQ] = useState('')
  const [minBudget, setMinBudget] = useState('')

  useEffect(() => {
    runSearch({})
  }, [runSearch])

  const onSearch = (e) => {
    e.preventDefault()
    runSearch({ q, min_budget: minBudget })
  }

  const usingSample = !isFetching && campaigns.length === 0

  return (
    <>
      <AppNav />
      <div className="nd-page">
        <div className="nd-page-head">
          <div className="nd-page-head__titles">
            <h1 className="nd-h1">Open briefs</h1>
            <p className="nd-sub">
              Find open campaigns and apply with your rate.
            </p>
          </div>
        </div>

        <form
          className="nd-row nd-wrap"
          style={{ gap: 10, marginBottom: 18 }}
          onSubmit={onSearch}
        >
          <input
            className="nd-input nd-grow"
            placeholder="Search by title"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            className="nd-input"
            style={{ maxWidth: 180 }}
            placeholder="Min budget"
            type="number"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
          />
          <button className="nd-btn nd-btn--primary" type="submit">
            {isFetching ? 'Searching…' : 'Search'}
          </button>
        </form>

        {usingSample ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <SampleBanner>
                Sample open briefs — live campaigns appear here once the
                campaign service is running.
              </SampleBanner>
            </div>
            {sampleInvites.map((s) => (
              <div
                className="nd-card"
                style={{ marginBottom: 14 }}
                key={s.brand}
              >
                <div
                  className="nd-between"
                  style={{ alignItems: 'flex-start' }}
                >
                  <div>
                    <div className="nd-h2">{s.campaign}</div>
                    <div
                      className="nd-muted"
                      style={{ fontSize: '0.8rem', marginTop: 4 }}
                    >
                      {s.brand} · {s.deliverables} · {s.usage}
                    </div>
                  </div>
                  <span className="nd-mono" style={{ fontWeight: 500 }}>
                    {s.offer}
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
