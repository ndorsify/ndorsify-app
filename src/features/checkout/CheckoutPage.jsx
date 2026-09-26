import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

import './checkout.css'
import { PAGE_ROUTES, buildPath } from '../../routes'
import { money } from '../../lib/format'
import { apiErrorMessage } from '../../lib/errors'
import { selectIsAuthed } from '../auth/authSlice'
import {
  useFundCampaignMutation,
  useGetCampaignQuery
} from '../campaigns/campaignApi'

const paymentMethods = [
  {
    id: 'visa',
    tag: 'VISA',
    name: 'Visa ending 4242',
    detail: 'Kettle & Fern · expires 09/28',
    fee: 'No fee'
  },
  {
    id: 'ach',
    tag: 'ACH',
    name: 'Bank transfer · Mercury',
    detail: 'Clears in 1–2 business days',
    fee: 'No fee'
  },
  {
    id: 'card',
    tag: 'AMEX',
    name: 'Amex ending 1005',
    detail: 'Rachel Oyelaran',
    fee: '+2.9% card fee'
  }
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { id = '1' } = useParams()
  const liveSession = useSelector(selectIsAuthed)
  const { data: campaign, error: campaignError } = useGetCampaignQuery(id, {
    skip: !liveSession
  })
  const [fund, { isLoading: funding, error: fundError }] =
    useFundCampaignMutation()
  const [method, setMethod] = useState('visa')
  const [autoRelease, setAutoRelease] = useState(true)

  const title = campaign?.title || (liveSession ? '' : 'Spring Glow Launch')
  const budget = campaign?.budget_amount ?? 0

  const onFund = async () => {
    if (!liveSession) {
      return navigate(buildPath(PAGE_ROUTES.CONTRACT, { id }))
    }
    try {
      await fund(id).unwrap()
      navigate(buildPath(PAGE_ROUTES.CONTRACT, { id }))
    } catch {
      /* rendered inline via fundError; stay on the page */
    }
  }

  return (
    <div className="co">
      <header className="co__bar">
        <Link to={PAGE_ROUTES.DASHBOARD} className="nd-brand">
          <span className="nd-brand__mark" />
          <span className="nd-brand__word">Ndorsify</span>
        </Link>
        <span className="nd-eyebrow">
          Secure checkout{title ? ` · ${title}` : ''}
        </span>
        <span className="nd-pill nd-pill--success">
          Funding acknowledgment · full escrow in a later phase
        </span>
      </header>

      {liveSession && campaignError && (
        <p className="nd-error" style={{ margin: '0 28px' }}>
          {apiErrorMessage(campaignError)}
        </p>
      )}

      <div className="co__grid">
        <main className="nd-stack" style={{ gap: 18 }}>
          <div className="nd-stack" style={{ gap: 8 }}>
            <h1 className="nd-h1" style={{ fontSize: '1.75rem' }}>
              Fund the campaign
            </h1>
            <p
              className="nd-ink2"
              style={{ fontSize: '0.9rem', maxWidth: 560 }}
            >
              Confirming funding here records your commitment on the campaign.
              Real payment processing and escrow lands in a later phase.
            </p>
          </div>

          <div className="nd-card nd-stack" style={{ gap: 12 }}>
            <div className="nd-h3">Payment method</div>
            <div className="nd-stack" style={{ gap: 10 }}>
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={
                    m.id === method ? 'co__method is-on' : 'co__method'
                  }
                  onClick={() => setMethod(m.id)}
                >
                  <span className="co__method-tag nd-mono">{m.tag}</span>
                  <span className="nd-grow nd-stack" style={{ gap: 2 }}>
                    <span className="nd-h3" style={{ fontSize: '0.86rem' }}>
                      {m.name}
                    </span>
                    <span className="nd-muted" style={{ fontSize: '0.74rem' }}>
                      {m.detail}
                    </span>
                  </span>
                  <span
                    className="nd-mono nd-ink2"
                    style={{ fontSize: '0.74rem' }}
                  >
                    {m.fee}
                  </span>
                  <span className="co__radio" aria-hidden />
                </button>
              ))}
            </div>
            <button className="nd-add" type="button">
              + Add payment method
            </button>
            <p className="nd-muted" style={{ fontSize: '0.72rem' }}>
              Illustrative — not wired to a real payment processor yet.
            </p>
          </div>

          <div className="nd-card nd-stack" style={{ gap: 12 }}>
            <div className="nd-h3">Release schedule</div>
            <p
              className="nd-ink2"
              style={{ fontSize: '0.82rem', lineHeight: 1.55 }}
            >
              Deliverables release per creator as each is approved on the
              collaboration board. Once real escrow lands, unaccepted offers
              will be refunded automatically.
            </p>
            <label className="co__auto">
              <span
                className={autoRelease ? 'nd-check is-done' : 'nd-check'}
                onClick={() => setAutoRelease((v) => !v)}
                role="checkbox"
                aria-checked={autoRelease}
                tabIndex={0}
              >
                {autoRelease ? '✓' : ''}
              </span>
              <span style={{ fontSize: '0.82rem' }}>
                Auto-release approved deliverables without a second confirmation
              </span>
            </label>
          </div>
        </main>

        <aside className="nd-stack" style={{ gap: 16 }}>
          <div className="nd-card nd-stack" style={{ gap: 13 }}>
            <div className="nd-h3">Order summary</div>
            <div
              className="nd-between"
              style={{ fontSize: '0.82rem', color: 'var(--ink-2)' }}
            >
              <span>Campaign budget</span>
              <span className="nd-mono" style={{ color: 'var(--ink)' }}>
                {money(budget)}
              </span>
            </div>
            <div className="co__total">
              <span className="nd-h3" style={{ fontSize: '0.85rem' }}>
                Total
              </span>
              <span
                className="nd-mono"
                style={{ fontSize: '1.4rem', fontWeight: 600 }}
              >
                {money(budget)}
              </span>
            </div>
            <button
              className="nd-btn nd-btn--primary nd-btn--lg nd-btn--block"
              onClick={onFund}
              disabled={funding}
            >
              {funding
                ? 'Confirming…'
                : `Confirm ${money(budget)} — mark as funded`}
            </button>
            {fundError && (
              <p className="nd-error">{apiErrorMessage(fundError)}</p>
            )}
            <p
              className="nd-muted"
              style={{ fontSize: '0.73rem', lineHeight: 1.5 }}
            >
              No payment is actually charged — this records a funding
              acknowledgment on the campaign.
            </p>
          </div>

          <div className="nd-card nd-card--accent nd-stack" style={{ gap: 6 }}>
            <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
              Why funding matters
            </div>
            <p
              className="nd-ink2"
              style={{ fontSize: '0.78rem', lineHeight: 1.55 }}
            >
              Funded campaigns get a higher acceptance rate — creators can see
              your budget is committed before they commit filming time.
            </p>
          </div>

          <div className="nd-card nd-stack" style={{ gap: 6 }}>
            <span className="nd-eyebrow">Billing contact</span>
            <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
              Rachel Oyelaran · finance@kettleandfern.com
            </div>
            <p
              className="nd-muted"
              style={{ fontSize: '0.74rem', lineHeight: 1.5 }}
            >
              Invoice and W-9 pack emailed on completion. NET-30 available on
              annual plans.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
