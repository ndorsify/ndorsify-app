import { useNavigate } from 'react-router-dom'

import './report.css'
import AppNav from '../../components/common/AppNav'
import { Avatar, ChartPlaceholder, Kpi } from '../../components/common/ds'
import { PAGE_ROUTES } from '../../routes'

const kpis = [
  { label: 'Total reach', value: '2.21M', delta: '+16%', note: 'vs. target' },
  {
    label: 'Engagement rate',
    value: '5.8%',
    delta: '+0.9pt',
    note: 'vs. beauty benchmark'
  },
  {
    label: 'Link clicks',
    value: '48,200',
    delta: '3.2% CTR',
    note: '7-day window'
  },
  {
    label: 'Attributed revenue',
    value: '$144,800',
    delta: '3.4× ROAS',
    note: 'on $42,600 spend'
  }
]

const breakdown = [
  {
    initials: 'MO',
    name: 'Maya Okonkwo',
    deliverable: '2 Reels',
    spend: '$3,200',
    reach: '612K',
    engagement: '6.4%',
    clicks: '14,900',
    cpm: '$5.2'
  },
  {
    initials: 'NM',
    name: 'Naledi Mokoena',
    deliverable: '2 Reels',
    spend: '$3,000',
    reach: '548K',
    engagement: '5.9%',
    clicks: '12,100',
    cpm: '$5.5'
  },
  {
    initials: 'CR',
    name: 'Cass Rivera',
    deliverable: '2 Reels',
    spend: '$2,400',
    reach: '388K',
    engagement: '4.8%',
    clicks: '7,200',
    cpm: '$6.2'
  },
  {
    initials: 'AD',
    name: 'Amara Diallo',
    deliverable: 'Reel + Story',
    spend: '$2,600',
    reach: '411K',
    engagement: '5.1%',
    clicks: '8,400',
    cpm: '$6.3'
  }
]

const insights = [
  'Reels outperformed Story sets 2.3× on clicks — reallocate budget to Reels next time.',
  'Posting Tue–Thu drove 40% more saves than weekend posts.',
  'Creators who filmed in natural light held viewers 1.8× longer.'
]

export default function ReportPage() {
  const navigate = useNavigate()

  return (
    <>
      <AppNav />
      <div className="rp">
        <div className="rp__head">
          <div className="nd-stack" style={{ gap: 6 }}>
            <button
              className="nd-btn nd-btn--ghost nd-btn--sm"
              style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
              onClick={() => navigate(PAGE_ROUTES.CAMPAIGNS)}
            >
              ← Campaigns
            </button>
            <h1 className="nd-h1">Spring Glow Launch — final report</h1>
            <span
              className="nd-pill nd-pill--success"
              style={{ alignSelf: 'flex-start' }}
            >
              Completed May 4
            </span>
          </div>
          <div className="nd-row nd-wrap" style={{ gap: 10 }}>
            <button className="nd-btn nd-btn--secondary nd-btn--sm">
              Export PDF
            </button>
            <button className="nd-btn nd-btn--primary nd-btn--sm">
              Rebook top 4 creators
            </button>
          </div>
        </div>

        <div className="nd-kpis" style={{ marginBottom: 20 }}>
          {kpis.map((k) => (
            <Kpi
              key={k.label}
              label={k.label}
              value={k.value}
              delta={k.delta}
              note={k.note}
            />
          ))}
        </div>

        <div className="rp__grid">
          <main className="nd-stack" style={{ gap: 20 }}>
            <div className="nd-card">
              <div className="nd-card-head">
                <div className="nd-h3">Creator breakdown</div>
                <span className="nd-eyebrow">Sorted by CPM</span>
              </div>
              <div className="nd-thead rp__row">
                <span>Creator</span>
                <span>Spend</span>
                <span>Reach</span>
                <span>Engage</span>
                <span>Clicks</span>
                <span>CPM</span>
              </div>
              {breakdown.map((r) => (
                <div className="nd-trow rp__row" key={r.name}>
                  <span className="nd-row" style={{ gap: 10 }}>
                    <Avatar label={r.initials} size={30} />
                    <span className="nd-stack" style={{ gap: 1 }}>
                      <span className="nd-h3" style={{ fontSize: '0.82rem' }}>
                        {r.name}
                      </span>
                      <span className="nd-muted" style={{ fontSize: '0.7rem' }}>
                        {r.deliverable}
                      </span>
                    </span>
                  </span>
                  <span className="nd-mono">{r.spend}</span>
                  <span className="nd-mono">{r.reach}</span>
                  <span className="nd-mono">{r.engagement}</span>
                  <span className="nd-mono">{r.clicks}</span>
                  <span className="nd-mono">{r.cpm}</span>
                </div>
              ))}
            </div>

            <div className="nd-card">
              <div className="nd-card-head">
                <div className="nd-h3">
                  Reach &amp; conversions over the flight
                </div>
                <div className="nd-row" style={{ gap: 14 }}>
                  <span className="rp__legend rp__legend--reach">Reach</span>
                  <span className="rp__legend rp__legend--orders">Orders</span>
                </div>
              </div>
              <ChartPlaceholder
                label="dual-axis line chart · Apr 6 – May 4"
                height={200}
              />
            </div>
          </main>

          <aside className="nd-stack" style={{ gap: 16 }}>
            <div className="nd-card nd-card--dark nd-stack" style={{ gap: 6 }}>
              <span
                className="nd-eyebrow"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Blended ROAS
              </span>
              <div
                className="nd-mono"
                style={{ fontSize: '2.2rem', fontWeight: 600 }}
              >
                3.4×
              </div>
              <p
                style={{ fontSize: '0.78rem', lineHeight: 1.55, opacity: 0.82 }}
              >
                $144,800 attributed revenue on $42,600 spend, 7-day click
                window.
              </p>
            </div>

            <div className="nd-card nd-stack" style={{ gap: 12 }}>
              <div className="nd-h3">What we learned</div>
              <ul className="rp__insights">
                {insights.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div
              className="nd-card nd-card--accent nd-stack"
              style={{ gap: 8 }}
            >
              <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
                Suggested next campaign
              </div>
              <p
                className="nd-ink2"
                style={{ fontSize: '0.8rem', lineHeight: 1.55 }}
              >
                Rebook Maya, Naledi, Amara and Cass with 2 Reels each and skip
                the Story sets.
              </p>
              <button
                className="nd-btn nd-btn--primary nd-btn--sm"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => navigate(PAGE_ROUTES.CAMPAIGN_NEW)}
              >
                Start from this
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
