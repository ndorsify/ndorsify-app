import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import './profile.css'
import AppNav from '../../components/common/AppNav'
import { Toggle } from '../../components/common/ds'
import { apiErrorMessage } from '../../lib/errors'
import { selectUser } from '../auth/authSlice'
import {
  joinList,
  splitList,
  toRateCardPayload,
  validateRateCard
} from './helpers'
import { editorNav } from '../../lib/sampleData'
import ConnectedPlatforms from './ConnectedPlatforms'
import RateCardEditor from './RateCardEditor'
import {
  useGetBrandProfileQuery,
  useGetCreatorProfileQuery,
  useGetMyRateCardQuery,
  useSaveRateCardMutation,
  useUpsertBrandProfileMutation,
  useUpsertCreatorProfileMutation
} from './profileApi'

/* --------------------------------------------------------------- Creator */
function CreatorEditor({ userId }) {
  const { data } = useGetCreatorProfileQuery(userId, { skip: !userId })
  const [upsert, { isLoading, error, isSuccess }] =
    useUpsertCreatorProfileMutation()

  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    niches: '',
    location: '',
    languages: '',
    avatar_url: ''
  })
  const { data: rateCard } = useGetMyRateCardQuery()
  const [saveRateCard] = useSaveRateCardMutation()

  const [packages, setPackages] = useState([])
  const [hidden, setHidden] = useState(false)
  const [rateErrors, setRateErrors] = useState([])
  // Still local-only: these belong to the offers flow, not the rate card.
  const [availability, setAvailability] = useState({
    open: true,
    autodecline: true
  })
  const [dirty, setDirty] = useState(0)

  useEffect(() => {
    if (data) {
      setForm({
        display_name: data.display_name || '',
        bio: data.bio || '',
        niches: joinList(data.niches),
        location: data.location || '',
        languages: joinList(data.languages),
        avatar_url: data.avatar_url || ''
      })
    }
  }, [data])

  useEffect(() => {
    if (rateCard) {
      setPackages(
        (rateCard.packages || []).map((p, i) => ({ ...p, key: `saved-${i}` }))
      )
      setHidden(Boolean(rateCard.hidden))
    }
  }, [rateCard])

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value })
    setDirty((d) => d + 1)
  }
  const toggle = (k) => () => {
    setAvailability((a) => ({ ...a, [k]: !a[k] }))
  }

  const onPublish = async () => {
    const errors = validateRateCard(packages)
    setRateErrors(errors)
    if (errors.length) return

    const [profileResult, rateResult] = await Promise.allSettled([
      upsert({
        display_name: form.display_name,
        bio: form.bio,
        niches: splitList(form.niches),
        location: form.location,
        languages: splitList(form.languages),
        avatar_url: form.avatar_url
      }).unwrap(),
      saveRateCard(toRateCardPayload(hidden, packages)).unwrap()
    ])
    // Each request reports its own failure inline; the dirty marker only
    // clears when both actually landed.
    if (
      profileResult.status === 'fulfilled' &&
      rateResult.status === 'fulfilled'
    ) {
      setDirty(0)
    }
  }

  return (
    <div className="pe">
      <div className="pe__bar">
        <div className="nd-row" style={{ gap: 14 }}>
          <div className="nd-h3">Edit profile</div>
          {dirty > 0 && (
            <span className="nd-pill nd-pill--warn">
              {dirty} unsaved change{dirty === 1 ? '' : 's'}
            </span>
          )}
          {isSuccess && dirty === 0 && (
            <span className="nd-ok">Published.</span>
          )}
        </div>
        <div className="nd-row" style={{ gap: 10 }}>
          <button
            className="nd-btn nd-btn--primary nd-btn--sm"
            onClick={onPublish}
            disabled={isLoading}
          >
            {isLoading ? 'Publishing…' : 'Publish changes'}
          </button>
        </div>
      </div>

      <div className="pe__body">
        <aside className="pe__nav">
          <span className="nd-eyebrow" style={{ paddingBottom: 4 }}>
            Sections
          </span>
          {editorNav.map((n) => (
            <div
              className={n.active ? 'pe__navitem is-active' : 'pe__navitem'}
              key={n.label}
            >
              {n.label}
              {n.badge && (
                <span
                  className="nd-mono nd-muted"
                  style={{ fontSize: '0.68rem' }}
                >
                  {n.badge}
                </span>
              )}
            </div>
          ))}
        </aside>

        <main className="pe__col">
          <div className="nd-h1" style={{ fontSize: '1.25rem' }}>
            Basics
          </div>
          <div className="pe__basics">
            <label className="nd-field">
              <span>Display name</span>
              <input
                className="nd-input"
                value={form.display_name}
                onChange={set('display_name')}
              />
            </label>
            <label className="nd-field">
              <span>Location</span>
              <input
                className="nd-input"
                value={form.location}
                onChange={set('location')}
              />
            </label>
            <label className="nd-field pe__span2">
              <span>Bio</span>
              <textarea
                className="nd-textarea"
                value={form.bio}
                onChange={set('bio')}
              />
            </label>
            <label className="nd-field">
              <span>Niches (comma-separated)</span>
              <input
                className="nd-input"
                value={form.niches}
                onChange={set('niches')}
                placeholder="skincare, beauty"
              />
            </label>
            <label className="nd-field">
              <span>Languages</span>
              <input
                className="nd-input"
                value={form.languages}
                onChange={set('languages')}
                placeholder="English, Yoruba"
              />
            </label>
            <label className="nd-field">
              <span>Avatar URL</span>
              <input
                className="nd-input"
                value={form.avatar_url}
                onChange={set('avatar_url')}
                placeholder="https://…"
              />
            </label>
          </div>

          <RateCardEditor
            errors={rateErrors}
            onChange={(next) => {
              setPackages(next)
              setDirty((d) => d + 1)
            }}
            packages={packages}
          />
        </main>

        <aside className="pe__col pe__col--right">
          <ConnectedPlatforms />

          <div className="nd-card nd-stack" style={{ gap: 12 }}>
            <div className="nd-h3" style={{ fontSize: '0.85rem' }}>
              Availability &amp; boundaries
            </div>
            <div className="nd-between">
              <span style={{ fontSize: '0.8rem' }}>Open to new campaigns</span>
              <Toggle on={availability.open} onClick={toggle('open')} />
            </div>
            <div className="nd-between">
              <span style={{ fontSize: '0.8rem' }}>
                Auto-decline offers under $1,500
              </span>
              <Toggle
                on={availability.autodecline}
                onClick={toggle('autodecline')}
              />
            </div>
            <div className="nd-between">
              <span style={{ fontSize: '0.8rem' }}>
                Hide rate card from public search
              </span>
              <Toggle
                on={hidden}
                onClick={() => {
                  setHidden((h) => !h)
                  setDirty((d) => d + 1)
                }}
              />
            </div>
            <span className="nd-eyebrow" style={{ paddingTop: 4 }}>
              Categories I won't promote
            </span>
            <div className="nd-row nd-wrap" style={{ gap: 7 }}>
              {['Skin bleaching', 'Diet supplements', 'Gambling'].map((c) => (
                <span className="nd-pill nd-pill--outline" key={c}>
                  {c} <span className="nd-muted">✕</span>
                </span>
              ))}
            </div>
          </div>
          {error && <p className="nd-error">{apiErrorMessage(error)}</p>}
          {rateErrors.length > 0 && (
            <p className="nd-error">
              Fix the highlighted packages, then publish.
            </p>
          )}
        </aside>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- Brand */
function BrandEditor({ userId }) {
  const { data } = useGetBrandProfileQuery(userId, { skip: !userId })
  const [upsert, { isLoading, error, isSuccess }] =
    useUpsertBrandProfileMutation()
  const [form, setForm] = useState({
    company_name: '',
    industry: '',
    logo_url: '',
    website: '',
    about: ''
  })
  const [dirty, setDirty] = useState(0)

  useEffect(() => {
    if (data) {
      setForm({
        company_name: data.company_name || '',
        industry: data.industry || '',
        logo_url: data.logo_url || '',
        website: data.website || '',
        about: data.about || ''
      })
    }
  }, [data])

  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value })
    setDirty((d) => d + 1)
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await upsert(form).unwrap()
      setDirty(0)
    } catch {
      /* rendered inline */
    }
  }

  return (
    <div className="nd-page nd-page--narrow">
      <div className="nd-page-head">
        <div className="nd-page-head__titles">
          <div className="nd-row" style={{ gap: 14 }}>
            <h1 className="nd-h1">Brand profile</h1>
            {dirty > 0 && (
              <span className="nd-pill nd-pill--warn">
                {dirty} unsaved change{dirty === 1 ? '' : 's'}
              </span>
            )}
            {isSuccess && dirty === 0 && <span className="nd-ok">Saved.</span>}
          </div>
          <p className="nd-sub">Tell creators who you are.</p>
        </div>
      </div>
      <form className="nd-card" onSubmit={onSubmit}>
        <div className="pe__basics">
          <label className="nd-field">
            <span>Company name</span>
            <input
              className="nd-input"
              value={form.company_name}
              onChange={set('company_name')}
            />
          </label>
          <label className="nd-field">
            <span>Industry</span>
            <input
              className="nd-input"
              value={form.industry}
              onChange={set('industry')}
            />
          </label>
          <label className="nd-field">
            <span>Website</span>
            <input
              className="nd-input"
              value={form.website}
              onChange={set('website')}
            />
          </label>
          <label className="nd-field">
            <span>Logo URL</span>
            <input
              className="nd-input"
              value={form.logo_url}
              onChange={set('logo_url')}
            />
          </label>
          <label className="nd-field pe__span2">
            <span>About</span>
            <textarea
              className="nd-textarea"
              value={form.about}
              onChange={set('about')}
            />
          </label>
        </div>
        {error && <p className="nd-error">{apiErrorMessage(error)}</p>}
        <button
          type="submit"
          className="nd-btn nd-btn--primary nd-btn--lg"
          disabled={isLoading}
        >
          {isLoading ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  )
}

export default function ProfileEditPage() {
  const user = useSelector(selectUser)
  const isBrand = user?.role === 'brand'
  return (
    <>
      <AppNav />
      {isBrand ? (
        <BrandEditor userId={user?.id} />
      ) : (
        <CreatorEditor userId={user?.id} />
      )}
    </>
  )
}
