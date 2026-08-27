import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import './profile.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import { apiErrorMessage } from '../../lib/errors'
import { selectUser } from '../auth/authSlice'
import { joinList, splitList } from './helpers'
import {
  useGetBrandProfileQuery,
  useGetCreatorProfileQuery,
  useUpsertBrandProfileMutation,
  useUpsertCreatorProfileMutation
} from './profileApi'

const ORANGE = '#FF914D'

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  )
}

function CreatorForm({ userId }) {
  const { data } = useGetCreatorProfileQuery(userId, { skip: !userId })
  const [upsert, { isLoading, data: saved, error, isSuccess }] =
    useUpsertCreatorProfileMutation()

  const [form, setForm] = useState({
    display_name: '',
    bio: '',
    niches: '',
    location: '',
    languages: '',
    avatar_url: ''
  })

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

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const completion =
    (saved && saved.completion_pct) ?? (data && data.completion_pct) ?? 0

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await upsert({
        display_name: form.display_name,
        bio: form.bio,
        niches: splitList(form.niches),
        location: form.location,
        languages: splitList(form.languages),
        avatar_url: form.avatar_url
      }).unwrap()
    } catch {
      /* rendered below */
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="completion">
        <div className="completion-label">
          <span>Profile completeness</span>
          <span>{completion}%</span>
        </div>
        <div className="completion-track">
          <div className="completion-fill" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <Field label="Display name">
        <input value={form.display_name} onChange={set('display_name')} />
      </Field>
      <Field label="Bio">
        <textarea value={form.bio} onChange={set('bio')} />
      </Field>
      <Field label="Niches (comma-separated)">
        <input
          value={form.niches}
          onChange={set('niches')}
          placeholder="tech, gaming, food"
        />
      </Field>
      <Field label="Location">
        <input value={form.location} onChange={set('location')} />
      </Field>
      <Field label="Languages (comma-separated)">
        <input
          value={form.languages}
          onChange={set('languages')}
          placeholder="English, Hindi"
        />
      </Field>
      <Field label="Avatar URL">
        <input value={form.avatar_url} onChange={set('avatar_url')} />
      </Field>

      {error && <p className="form-error">{apiErrorMessage(error)}</p>}
      {isSuccess && !error && <p className="form-ok">Profile saved.</p>}
      <Button
        type="submit"
        color={ORANGE}
        primary
        size="large"
        label={isLoading ? 'Saving…' : 'Save profile'}
      />
    </form>
  )
}

function BrandForm({ userId }) {
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

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await upsert(form).unwrap()
    } catch {
      /* rendered below */
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Field label="Company name">
        <input value={form.company_name} onChange={set('company_name')} />
      </Field>
      <Field label="Industry">
        <input value={form.industry} onChange={set('industry')} />
      </Field>
      <Field label="Website">
        <input value={form.website} onChange={set('website')} />
      </Field>
      <Field label="Logo URL">
        <input value={form.logo_url} onChange={set('logo_url')} />
      </Field>
      <Field label="About">
        <textarea value={form.about} onChange={set('about')} />
      </Field>

      {error && <p className="form-error">{apiErrorMessage(error)}</p>}
      {isSuccess && !error && <p className="form-ok">Profile saved.</p>}
      <Button
        type="submit"
        color={ORANGE}
        primary
        size="large"
        label={isLoading ? 'Saving…' : 'Save profile'}
      />
    </form>
  )
}

export default function ProfileEditPage() {
  const user = useSelector(selectUser)
  const isBrand = user?.role === 'brand'

  return (
    <>
      <AppNav />
      <div className="page">
        <h1>{isBrand ? 'Brand profile' : 'Creator profile'}</h1>
        <p className="subtle">
          {isBrand
            ? 'Tell creators who you are.'
            : 'Complete your profile so brands can find you.'}
        </p>
        {isBrand ? (
          <BrandForm userId={user?.id} />
        ) : (
          <CreatorForm userId={user?.id} />
        )}
      </div>
    </>
  )
}
