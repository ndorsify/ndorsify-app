import { useState } from 'react'
import { useSelector } from 'react-redux'

import './discovery.css'
import '../profile/profile.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import { apiErrorMessage } from '../../lib/errors'
import { selectUser } from '../auth/authSlice'
import { splitList } from '../profile/helpers'
import {
  useAddToShortlistMutation,
  useCreateShortlistMutation,
  useLazySearchCreatorsQuery
} from './discoveryApi'

const ORANGE = '#FF914D'

export default function DiscoverPage() {
  const user = useSelector(selectUser)
  const isBrand = user?.role === 'brand'

  const [filters, setFilters] = useState({
    q: '',
    niche: '',
    min_followers: '',
    sort: 'followers'
  })
  const [runSearch, { data: results = [], isFetching, error }] =
    useLazySearchCreatorsQuery()

  // A single active shortlist for this session (backend has no "list mine" yet).
  const [shortlist, setShortlist] = useState(null) // {id, name, creator_ids}
  const [shortlistName, setShortlistName] = useState('')
  const [createShortlist] = useCreateShortlistMutation()
  const [addToShortlist] = useAddToShortlistMutation()

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value })

  const onSearch = (e) => {
    e.preventDefault()
    runSearch({
      q: filters.q,
      niche: splitList(filters.niche),
      min_followers: filters.min_followers,
      sort: filters.sort
    })
  }

  const onCreateShortlist = async () => {
    if (!shortlistName.trim()) return
    try {
      const sl = await createShortlist({ name: shortlistName.trim() }).unwrap()
      setShortlist({ ...sl, creator_ids: [] })
      setShortlistName('')
    } catch {
      /* ignore */
    }
  }

  const onAdd = async (creatorId) => {
    if (!shortlist) return
    try {
      const detail = await addToShortlist({
        shortlistId: shortlist.id,
        creatorId
      }).unwrap()
      setShortlist(detail)
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <AppNav />
      <div className="page">
        <h1>Discover creators</h1>
        <p className="subtle">Search the creator directory and build a shortlist.</p>

        {isBrand && (
          <div className="shortlist-panel">
            {shortlist ? (
              <>
                <strong>Shortlist: {shortlist.name}</strong>
                <div style={{ marginTop: 8 }}>
                  {(shortlist.creator_ids || []).length === 0 ? (
                    <span className="muted">No creators yet.</span>
                  ) : (
                    shortlist.creator_ids.map((id) => (
                      <span className="chip" key={id}>
                        creator #{id}
                      </span>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  placeholder="New shortlist name"
                  value={shortlistName}
                  onChange={(e) => setShortlistName(e.target.value)}
                  style={{ flex: 1, padding: '9px 11px', border: '1px solid var(--line)', borderRadius: 8 }}
                />
                <Button
                  type="button"
                  color={ORANGE}
                  primary
                  size="medium"
                  label="Create"
                  onClick={onCreateShortlist}
                />
              </div>
            )}
          </div>
        )}

        <form className="filters" onSubmit={onSearch}>
          <input className="full" placeholder="Search by name" value={filters.q} onChange={set('q')} />
          <input placeholder="Niches (comma-separated)" value={filters.niche} onChange={set('niche')} />
          <input placeholder="Min followers" type="number" value={filters.min_followers} onChange={set('min_followers')} />
          <select value={filters.sort} onChange={set('sort')}>
            <option value="followers">Sort: Followers</option>
            <option value="engagement">Sort: Engagement</option>
            <option value="rating">Sort: Rating</option>
          </select>
          <div className="full">
            <Button type="submit" color={ORANGE} primary size="large" label={isFetching ? 'Searching…' : 'Search'} />
          </div>
        </form>

        {error && <p className="form-error">{apiErrorMessage(error)}</p>}

        {results.length === 0 && !isFetching ? (
          <p className="muted">No results yet — run a search.</p>
        ) : (
          results.map((c) => (
            <div className="creator-card" key={c.user_id}>
              <div>
                <div className="name">{c.display_name || `Creator #${c.user_id}`}</div>
                <div className="meta">
                  {(c.niches || []).join(', ')}
                  {c.location ? ` · ${c.location}` : ''}
                </div>
                <div className="meta">
                  {c.follower_count} followers · {c.engagement_rate}% eng · ★ {c.avg_rating}
                </div>
              </div>
              {isBrand && shortlist && (
                <Button
                  type="button"
                  color={ORANGE}
                  primary={false}
                  size="medium"
                  label="Add"
                  onClick={() => onAdd(c.user_id)}
                />
              )}
            </div>
          ))
        )}
      </div>
    </>
  )
}
