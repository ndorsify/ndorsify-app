import { useState } from 'react'

import './campaigns.css'
import '../profile/profile.css'
import '../discovery/discovery.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import { apiErrorMessage } from '../../lib/errors'
import { useApplyMutation, useLazyMarketplaceQuery } from './campaignApi'

const ORANGE = '#FF914D'

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
    <div className="campaign-card">
      <h3>{campaign.title}</h3>
      <div className="meta">
        {campaign.objective || ''}
        {campaign.budget_amount
          ? ` · ${campaign.budget_amount} ${campaign.budget_currency || ''}`
          : ''}
        {(campaign.platforms || []).length ? ` · ${campaign.platforms.join(', ')}` : ''}
      </div>
      <div className="row-actions">
        <Button type="button" color={ORANGE} primary={false} size="small"
          label={open ? 'Cancel' : 'Apply'} onClick={() => setOpen(!open)} />
      </div>
      {open && (
        <div className="sub-panel">
          {isSuccess && !error ? (
            <p className="form-ok">Application submitted.</p>
          ) : (
            <form className="inline-form" onSubmit={onApply}>
              <input placeholder="Your proposal" value={proposal}
                onChange={(e) => setProposal(e.target.value)} style={{ flex: 1 }} />
              <input placeholder="Rate" type="number" value={rate}
                onChange={(e) => setRate(e.target.value)} />
              <Button type="submit" color={ORANGE} primary size="small"
                label={isLoading ? '…' : 'Submit'} />
            </form>
          )}
          {error && <p className="form-error">{apiErrorMessage(error)}</p>}
        </div>
      )}
    </div>
  )
}

export default function MarketplacePage() {
  const [runSearch, { data: campaigns = [], isFetching }] = useLazyMarketplaceQuery()
  const [q, setQ] = useState('')
  const [minBudget, setMinBudget] = useState('')

  const onSearch = (e) => {
    e.preventDefault()
    runSearch({ q, min_budget: minBudget })
  }

  return (
    <>
      <AppNav />
      <div className="page">
        <h1>Campaign marketplace</h1>
        <p className="subtle">Find open campaigns and apply.</p>

        <form className="filters" onSubmit={onSearch}>
          <input placeholder="Search by title" value={q} onChange={(e) => setQ(e.target.value)} />
          <input placeholder="Min budget" type="number" value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)} />
          <div className="full">
            <Button type="submit" color={ORANGE} primary size="large"
              label={isFetching ? 'Searching…' : 'Search'} />
          </div>
        </form>

        {campaigns.length === 0 && !isFetching ? (
          <p className="muted">No campaigns yet — run a search.</p>
        ) : (
          campaigns.map((c) => <CampaignRow campaign={c} key={c.id} />)
        )}
      </div>
    </>
  )
}
