import AppNav from '../../components/common/AppNav'
import './earnings.css'
import { ChartPlaceholder, SampleBanner } from '../../components/common/ds'
import { useMyCollaborationsQuery } from '../collaborations/collaborationApi'
import { creatorDocs, earningTiles, samplePayouts } from '../../lib/sampleData'

const stateVariant = (state) =>
  state === 'paid'
    ? 'nd-pill--success'
    : state === 'releasing'
      ? 'nd-pill--accent'
      : 'nd-pill--warn'

export default function EarningsPage() {
  const { data: collabs = [], isLoading } = useMyCollaborationsQuery()

  const live = collabs.map((c) => ({
    campaign: `Campaign #${c.campaign_id}`,
    deliverable: `${c.deliverables?.length || 0} deliverable(s)`,
    brand: `Brand #${c.brand_id}`,
    amount: '—',
    releases: '—',
    status: (c.status || '').replace('_', ' ') || 'active',
    state:
      c.status === 'completed'
        ? 'paid'
        : c.status === 'live'
          ? 'releasing'
          : 'escrow'
  }))
  const payouts = live.length ? live : samplePayouts
  const usingSample = live.length === 0

  return (
    <>
      <AppNav />
      <div className="nd-page">
        <div className="nd-page-head">
          <div className="nd-page-head__titles">
            <h1 className="nd-h1">Earnings &amp; payouts</h1>
            <p className="nd-sub">
              Track escrow, releases and statements in one place.
            </p>
          </div>
          <button className="nd-btn nd-btn--secondary">
            Download 2026 statements
          </button>
        </div>

        <div className="nd-kpis" style={{ marginBottom: 18 }}>
          {earningTiles.map((k) => (
            <div className="nd-kpi" key={k.label}>
              <div className="nd-kpi__label">{k.label}</div>
              <div className="nd-kpi__value">{k.value}</div>
              <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
                {k.note}
              </div>
            </div>
          ))}
        </div>

        <div className="ea">
          <div className="nd-stack">
            <div className="nd-card">
              <div className="nd-card-head">
                <div className="nd-h2">Payments</div>
                <div className="nd-seg">
                  <button className="nd-seg__item is-active">All</button>
                  <button className="nd-seg__item">In escrow</button>
                  <button className="nd-seg__item">Paid</button>
                </div>
              </div>
              <div className="nd-thead ea__row">
                <div>Campaign</div>
                <div>Brand</div>
                <div>Amount</div>
                <div>Releases</div>
                <div>Status</div>
              </div>
              {isLoading && <div className="nd-empty">Loading payments…</div>}
              {payouts.map((p, i) => (
                <div className="nd-trow ea__row" key={i}>
                  <div>
                    <div className="nd-h3" style={{ fontSize: '0.82rem' }}>
                      {p.campaign}
                    </div>
                    <div className="nd-muted" style={{ fontSize: '0.7rem' }}>
                      {p.deliverable}
                    </div>
                  </div>
                  <div className="nd-ink2" style={{ fontSize: '0.8rem' }}>
                    {p.brand}
                  </div>
                  <div
                    className="nd-mono"
                    style={{ fontSize: '0.85rem', fontWeight: 500 }}
                  >
                    {p.amount}
                  </div>
                  <div
                    className="nd-mono nd-ink2"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {p.releases}
                  </div>
                  <div>
                    <span className={`nd-pill ${stateVariant(p.state)}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
              {usingSample && (
                <div style={{ marginTop: 14 }}>
                  <SampleBanner>
                    Sample payments — connect the collaboration service for live
                    payouts.
                  </SampleBanner>
                </div>
              )}
            </div>

            <div className="nd-card">
              <div className="nd-card-head">
                <div className="nd-h2">Earnings by month</div>
                <span
                  className="nd-mono nd-muted"
                  style={{ fontSize: '0.7rem' }}
                >
                  2026 YTD · USD
                </span>
              </div>
              <ChartPlaceholder
                label="monthly earnings bar chart"
                height={96}
              />
            </div>
          </div>

          <div className="nd-stack">
            <div className="nd-card nd-card--dark nd-stack" style={{ gap: 12 }}>
              <span className="nd-eyebrow">Available to withdraw</span>
              <div
                className="nd-mono"
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 500,
                  letterSpacing: '-0.02em'
                }}
              >
                $4,350.00
              </div>
              <div className="nd-muted" style={{ fontSize: '0.75rem' }}>
                Next automatic payout Friday, Apr 10 · Wise (NGN)
              </div>
              <button className="nd-btn nd-btn--primary nd-btn--block">
                Withdraw now
              </button>
            </div>

            <div className="nd-card">
              <div className="nd-h2" style={{ marginBottom: 12 }}>
                Payout method
              </div>
              <div className="ea__method">
                <span className="ea__method-tag">WISE</span>
                <div className="nd-grow">
                  <div className="nd-h3" style={{ fontSize: '0.82rem' }}>
                    Wise · ending 4471
                  </div>
                  <div className="nd-muted" style={{ fontSize: '0.7rem' }}>
                    NGN · 1–2 business days
                  </div>
                </div>
                <span className="nd-pill nd-pill--success">Default</span>
              </div>
              <span
                className="nd-eyebrow"
                style={{ display: 'block', margin: '14px 0 8px' }}
              >
                Tax &amp; documents
              </span>
              <div className="nd-stack" style={{ gap: 8 }}>
                {creatorDocs.map((d) => (
                  <div className="ea__doc" key={d.name}>
                    <span className="ea__doc-ext">{d.ext}</span>
                    <div className="nd-grow" style={{ minWidth: 0 }}>
                      <div
                        className="nd-h3"
                        style={{
                          fontSize: '0.78rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {d.name}
                      </div>
                      <div
                        className="nd-mono nd-muted"
                        style={{ fontSize: '0.68rem' }}
                      >
                        {d.meta}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
