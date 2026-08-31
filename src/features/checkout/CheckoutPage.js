import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import './checkout.css'
import { PAGE_ROUTES, buildPath } from '../../routes'
import { money } from '../../lib/format'

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

const releaseSchedule = [
  {
    label: 'On draft approval',
    detail: 'Released per creator as each deliverable is approved',
    amount: money(38400)
  },
  {
    label: 'Platform service fee',
    detail: 'Charged to you, never deducted from creators',
    amount: money(3700)
  },
  {
    label: 'Refundable hold',
    detail: 'Unaccepted offers returned within 3 business days',
    amount: money(500)
  }
]

const summaryAmounts = [
  { label: 'Creator offers (8)', amount: 38400 },
  { label: 'Ndorsify service (5%)', amount: 3700 },
  { label: 'Refundable escrow hold', amount: 500 }
]

const summary = summaryAmounts.map((s) => ({
  label: s.label,
  value: money(s.amount)
}))

// Derived from the line items above so the charged total can never drift
// from what's actually shown to the brand.
const total = summaryAmounts.reduce((sum, s) => sum + s.amount, 0)

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { id = '1' } = useParams()
  const [method, setMethod] = useState('visa')
  const [autoRelease, setAutoRelease] = useState(true)
  const [funding, setFunding] = useState(false)

  const onFund = () => {
    setFunding(true)
    // Escrow settlement is faked in demo mode; move on to the signature step.
    setTimeout(() => navigate(buildPath(PAGE_ROUTES.CONTRACT, { id })), 700)
  }

  return (
    <div className="co">
      <header className="co__bar">
        <Link to={PAGE_ROUTES.DASHBOARD} className="nd-brand">
          <span className="nd-brand__mark" />
          <span className="nd-brand__word">Ndorsify</span>
        </Link>
        <span className="nd-eyebrow">Secure checkout · Spring Glow Launch</span>
        <span className="nd-pill nd-pill--success">
          Held by Ndorsify Escrow · PCI DSS
        </span>
      </header>

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
              Money sits in escrow until each creator's deliverables are
              approved. Anything unaccepted comes straight back to you.
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
          </div>

          <div className="nd-card nd-stack" style={{ gap: 12 }}>
            <div className="nd-h3">Release schedule</div>
            {releaseSchedule.map((r) => (
              <div className="nd-between co__release" key={r.label}>
                <span className="nd-stack" style={{ gap: 2 }}>
                  <span className="nd-h3" style={{ fontSize: '0.85rem' }}>
                    {r.label}
                  </span>
                  <span className="nd-muted" style={{ fontSize: '0.74rem' }}>
                    {r.detail}
                  </span>
                </span>
                <span className="nd-mono" style={{ fontWeight: 600 }}>
                  {r.amount}
                </span>
              </div>
            ))}
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
            <div className="nd-stack" style={{ gap: 10 }}>
              {summary.map((c) => (
                <div
                  className="nd-between"
                  style={{ fontSize: '0.82rem', color: 'var(--ink-2)' }}
                  key={c.label}
                >
                  <span>{c.label}</span>
                  <span className="nd-mono" style={{ color: 'var(--ink)' }}>
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="co__total">
              <span className="nd-h3" style={{ fontSize: '0.85rem' }}>
                Charged today
              </span>
              <span
                className="nd-mono"
                style={{ fontSize: '1.4rem', fontWeight: 600 }}
              >
                {money(total)}
              </span>
            </div>
            <button
              className="nd-btn nd-btn--primary nd-btn--lg nd-btn--block"
              onClick={onFund}
              disabled={funding}
            >
              {funding
                ? 'Funding escrow…'
                : `Fund ${money(total)} & send invites`}
            </button>
            <p
              className="nd-muted"
              style={{ fontSize: '0.73rem', lineHeight: 1.5 }}
            >
              Refunds for unaccepted offers process within 3 business days.
            </p>
          </div>

          <div className="nd-card nd-card--accent nd-stack" style={{ gap: 6 }}>
            <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
              Why creators trust escrow
            </div>
            <p
              className="nd-ink2"
              style={{ fontSize: '0.78rem', lineHeight: 1.55 }}
            >
              Funded campaigns get a 2.4× higher acceptance rate. Creators can
              see your budget is already secured before they commit filming
              time.
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
