import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import './discovery.css'
import AppNav from '../../components/common/AppNav'
import { money } from '../../lib/format'
import { Avatar } from '../../components/common/ds'
import { PAGE_ROUTES, buildPath } from '../../routes'
import { apiErrorMessage } from '../../lib/errors'
import { selectUser } from '../auth/authSlice'
import {
  SIZE_BUCKETS,
  followersRange,
  toCreatorCard
} from '../../lib/creatorFilters'
import {
  useAddToShortlistMutation,
  useCreateShortlistMutation,
  useLazySearchCreatorsQuery
} from './discoveryApi'

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'X']

const RATE_FLOOR = 750
const RATE_CEIL = 5000

export default function DiscoverPage() {
  const isBrand = useSelector(selectUser)?.role === 'brand'

  const [q, setQ] = useState('')
  const [appliedQ, setAppliedQ] = useState('')
  const [sort, setSort] = useState('followers')
  const [platforms, setPlatforms] = useState([])
  const [sizes, setSizes] = useState([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [minRate, setMinRate] = useState(RATE_FLOOR)
  const [maxRate, setMaxRate] = useState(RATE_CEIL)

  const [runSearch, { data: results, isFetching, error }] =
    useLazySearchCreatorsQuery()

  const [shortlist, setShortlist] = useState(null)
  const [createShortlist] = useCreateShortlistMutation()
  const [addToShortlist] = useAddToShortlistMutation()

  // Everything except the free-text box auto-applies; the query text applies on
  // submit (via appliedQ). Recomputed params drive the effect below.
  const filterParams = useCallback(() => {
    const p = { sort, q: appliedQ }
    if (platforms.length) p.platform = platforms
    Object.assign(p, followersRange(sizes))
    if (verifiedOnly) p.verified = true
    if (minRate > RATE_FLOOR) p.min_rate = minRate
    if (maxRate < RATE_CEIL) p.max_rate = maxRate
    return p
  }, [sort, appliedQ, platforms, sizes, verifiedOnly, minRate, maxRate])

  useEffect(() => {
    runSearch(filterParams())
  }, [filterParams, runSearch])

  const toggle = (list, setList, value) =>
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    )

  const onSearch = (e) => {
    e.preventDefault()
    setAppliedQ(q)
  }

  const resetAll = () => {
    setQ('')
    setAppliedQ('')
    setSort('followers')
    setPlatforms([])
    setSizes([])
    setVerifiedOnly(false)
    setMinRate(RATE_FLOOR)
    setMaxRate(RATE_CEIL)
  }

  // Active-filter chips, each removable.
  const chips = [
    ...(appliedQ
      ? [
          {
            label: `“${appliedQ}”`,
            clear: () => {
              setQ('')
              setAppliedQ('')
            }
          }
        ]
      : []),
    ...platforms.map((p) => ({
      label: p,
      clear: () => toggle(platforms, setPlatforms, p)
    })),
    ...sizes.map((k) => ({
      label: SIZE_BUCKETS.find((b) => b.key === k).label,
      clear: () => toggle(sizes, setSizes, k)
    })),
    ...(verifiedOnly
      ? [{ label: 'ID verified', clear: () => setVerifiedOnly(false) }]
      : []),
    ...(minRate > RATE_FLOOR || maxRate < RATE_CEIL
      ? [
          {
            label: `${money(minRate)}–${money(maxRate)}`,
            clear: () => {
              setMinRate(RATE_FLOOR)
              setMaxRate(RATE_CEIL)
            }
          }
        ]
      : [])
  ]

  const cards = Array.isArray(results) ? results.map(toCreatorCard) : []

  const onInvite = async (creatorId) => {
    if (!isBrand) return
    try {
      let sl = shortlist
      if (!sl) {
        sl = await createShortlist({ name: 'Discovery shortlist' }).unwrap()
        setShortlist(sl)
      }
      const detail = await addToShortlist({
        shortlistId: sl.id,
        creatorId
      }).unwrap()
      setShortlist(detail)
    } catch {
      /* error surfaced by the mutation; ignore here */
    }
  }
  const invited = new Set(shortlist?.creator_ids || [])

  return (
    <>
      <AppNav />
      <div className="nd-page nd-page--flush">
        <div className="dc">
          {/* Filters */}
          <aside className="dc__filters">
            <div className="nd-between">
              <div className="nd-h3">Filters</div>
              <button
                className="nd-btn nd-btn--ghost nd-btn--sm"
                onClick={resetAll}
              >
                Reset
              </button>
            </div>

            <div className="nd-stack" style={{ gap: 11 }}>
              <span className="nd-eyebrow">Platform</span>
              {PLATFORMS.map((p) => (
                <button
                  type="button"
                  className="dc__check"
                  key={p}
                  onClick={() => toggle(platforms, setPlatforms, p)}
                >
                  <span
                    className={
                      platforms.includes(p) ? 'dc__box is-on' : 'dc__box'
                    }
                  >
                    {platforms.includes(p) ? '✓' : ''}
                  </span>
                  <span className="nd-grow" style={{ fontSize: '0.82rem' }}>
                    {p}
                  </span>
                </button>
              ))}
            </div>

            <div className="nd-stack" style={{ gap: 11 }}>
              <span className="nd-eyebrow">Audience size</span>
              {SIZE_BUCKETS.map((b) => (
                <button
                  type="button"
                  className="dc__check"
                  key={b.key}
                  onClick={() => toggle(sizes, setSizes, b.key)}
                >
                  <span
                    className={
                      sizes.includes(b.key) ? 'dc__box is-on' : 'dc__box'
                    }
                  >
                    {sizes.includes(b.key) ? '✓' : ''}
                  </span>
                  <span className="nd-grow" style={{ fontSize: '0.82rem' }}>
                    {b.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="nd-stack" style={{ gap: 11 }}>
              <span className="nd-eyebrow">Verification</span>
              <button
                type="button"
                className="dc__check"
                onClick={() => setVerifiedOnly((v) => !v)}
              >
                <span className={verifiedOnly ? 'dc__box is-on' : 'dc__box'}>
                  {verifiedOnly ? '✓' : ''}
                </span>
                <span className="nd-grow" style={{ fontSize: '0.82rem' }}>
                  ID verified only
                </span>
              </button>
            </div>

            <div className="nd-stack" style={{ gap: 10 }}>
              <span className="nd-eyebrow">Rate per post</span>
              <label className="dc__slider">
                <span className="dc__slider-lbl">Min {money(minRate)}</span>
                <input
                  type="range"
                  min={RATE_FLOOR}
                  max={RATE_CEIL}
                  step={50}
                  value={minRate}
                  onChange={(e) =>
                    setMinRate(Math.min(Number(e.target.value), maxRate))
                  }
                />
              </label>
              <label className="dc__slider">
                <span className="dc__slider-lbl">Max {money(maxRate)}</span>
                <input
                  type="range"
                  min={RATE_FLOOR}
                  max={RATE_CEIL}
                  step={50}
                  value={maxRate}
                  onChange={(e) =>
                    setMaxRate(Math.max(Number(e.target.value), minRate))
                  }
                />
              </label>
            </div>

            <button
              className="nd-btn nd-btn--primary nd-btn--block"
              onClick={() => setAppliedQ(q)}
            >
              Apply filters
            </button>
          </aside>

          {/* Results */}
          <section className="dc__results">
            <form className="dc__toolbar" onSubmit={onSearch}>
              <div className="nd-search nd-grow">
                <span className="nd-search__ring" />
                <input
                  placeholder="Search creators, niches, keywords"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <span
                  className="nd-mono nd-muted"
                  style={{ fontSize: '0.7rem' }}
                >
                  {cards.length} creators
                </span>
              </div>
              <select
                className="dc__sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="followers">Sort: Followers</option>
                <option value="engagement">Sort: Engagement</option>
                <option value="rating">Sort: Rating</option>
              </select>
              <button className="nd-btn nd-btn--secondary" type="submit">
                {isFetching ? 'Searching…' : 'Search'}
              </button>
            </form>

            {chips.length > 0 && (
              <div className="nd-row nd-wrap" style={{ gap: 8 }}>
                {chips.map((ch) => (
                  <button
                    type="button"
                    className="nd-pill nd-pill--outline"
                    key={ch.label}
                    onClick={ch.clear}
                  >
                    {ch.label} <span className="nd-muted">✕</span>
                  </button>
                ))}
              </div>
            )}

            {error && <p className="nd-error">{apiErrorMessage(error)}</p>}
            {!isFetching && !error && cards.length === 0 && (
              <p className="nd-muted" style={{ padding: '8px 2px' }}>
                No creators match these filters. Try widening your search or
                resetting the filters.
              </p>
            )}

            <div className="dc__grid">
              {cards.map((c) => (
                <div className="dc__card" key={c.id}>
                  <div
                    className="nd-row"
                    style={{ alignItems: 'flex-start', gap: 12 }}
                  >
                    <Avatar label={c.initials} size={48} />
                    <div className="nd-grow">
                      <div className="nd-row" style={{ gap: 6 }}>
                        <span className="nd-h3" style={{ fontSize: '0.95rem' }}>
                          {c.name}
                        </span>
                      </div>
                      <div className="nd-muted" style={{ fontSize: '0.75rem' }}>
                        {c.handle} · {c.location}
                      </div>
                    </div>
                  </div>
                  <div className="nd-row nd-wrap" style={{ gap: 6 }}>
                    <span className="nd-pill nd-pill--accent">{c.niche}</span>
                    <span className="nd-pill nd-pill--outline">
                      {c.platform}
                    </span>
                  </div>
                  <div className="dc__stats">
                    <div>
                      <div className="dc__stat-val">{c.followers}</div>
                      <div className="dc__stat-lbl">Followers</div>
                    </div>
                    <div>
                      <div
                        className="dc__stat-val"
                        style={{ color: 'var(--success-ink)' }}
                      >
                        {c.engagement}
                      </div>
                      <div className="dc__stat-lbl">Engage</div>
                    </div>
                    <div>
                      <div className="dc__stat-val">{c.rating}</div>
                      <div className="dc__stat-lbl">Rating</div>
                    </div>
                  </div>
                  <div className="nd-row" style={{ gap: 8 }}>
                    {isBrand && (
                      <button
                        className="nd-btn nd-btn--dark nd-btn--sm nd-grow"
                        style={{ justifyContent: 'center' }}
                        onClick={() => onInvite(c.id)}
                        disabled={invited.has(c.id)}
                      >
                        {invited.has(c.id) ? 'Shortlisted' : 'Invite'}
                      </button>
                    )}
                    <Link
                      to={buildPath(PAGE_ROUTES.CREATOR_PROFILE, { id: c.id })}
                      className="nd-btn nd-btn--secondary nd-btn--sm nd-grow"
                      style={{ justifyContent: 'center' }}
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
