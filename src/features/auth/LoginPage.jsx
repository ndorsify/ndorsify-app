import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import './auth.css'
import { apiErrorMessage } from '../../lib/errors'
import { PAGE_ROUTES } from '../../routes'
import { useLoginMutation } from './authApi'

const VALUE_POINTS = [
  {
    num: '1',
    title: 'Real audience data',
    body: 'Follower counts and engagement pulled straight from official APIs.'
  },
  {
    num: '2',
    title: 'Rates in the open',
    body: 'Agree on price transparently — no month-long email chains.'
  },
  {
    num: '3',
    title: 'Escrow-backed',
    body: 'Money is released only when deliverables are approved.'
  }
]

const STATS = [
  { value: '12,480', label: 'creators' },
  { value: '$38M', label: 'paid out' },
  { value: '4.9/5', label: 'brand rating' }
]

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || PAGE_ROUTES.DASHBOARD

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [login, { isLoading, error }] = useLoginMutation()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password }).unwrap()
      navigate(from, { replace: true })
    } catch {
      /* error is rendered below */
    }
  }

  return (
    <div className="auth">
      <div className="auth__panel">
        <div className="auth__main">
          <Link to={PAGE_ROUTES.HOME} className="auth__brand">
            <span className="nd-brand__mark" />
            <span className="nd-brand__word">Ndorsify</span>
          </Link>
          <div className="auth__head">
            <h1 className="nd-h1">Welcome back</h1>
            <p className="nd-sub">Sign in to your marketplace account.</p>
          </div>
          <form className="auth__form" onSubmit={onSubmit}>
            <label className="nd-field">
              <span>Email</span>
              <input
                className="nd-input"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </label>
            <label className="nd-field">
              <span>Password</span>
              <div className="auth__pass">
                <input
                  className="nd-input"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="auth__pass-toggle"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
            {error && (
              <p className="nd-error" role="alert">
                {apiErrorMessage(error, 'Invalid email or password.')}
              </p>
            )}
            <button
              type="submit"
              className="nd-btn nd-btn--primary nd-btn--lg nd-btn--block"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
            <div className="auth__or">
              <span>OR</span>
            </div>
            <div className="auth__oauth-row">
              <button type="button" className="nd-btn nd-btn--secondary">
                Continue with Google
              </button>
              <button type="button" className="nd-btn nd-btn--secondary">
                Continue with SSO
              </button>
            </div>
          </form>
          <p className="auth__links">
            New to Ndorsify?{' '}
            <Link to={PAGE_ROUTES.REGISTER}>Create an account</Link>
          </p>
        </div>

        <aside className="auth__side">
          <div className="auth__side-top">
            <span className="nd-eyebrow">Why teams pick Ndorsify</span>
            <div className="auth__steps">
              {VALUE_POINTS.map((s) => (
                <div className="auth__step" key={s.num}>
                  <span className="auth__step-num">{s.num}</span>
                  <div className="nd-stack" style={{ gap: 3 }}>
                    <span className="auth__step-title">{s.title}</span>
                    <span className="auth__step-body">{s.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <blockquote className="auth__quote">
            <span className="auth__quote-text">
              “We booked 14 creators for a product launch in nine days. The rate
              transparency alone saved my team a month of back-and-forth.”
            </span>
            <div className="auth__author">
              <span className="auth__author-avatar" aria-hidden />
              <div className="nd-stack" style={{ gap: 1 }}>
                <span className="auth__author-name">Rachel Oyelaran</span>
                <span className="auth__author-role">
                  Head of Growth, Kettle &amp; Fern
                </span>
              </div>
            </div>
            <div className="auth__stats">
              {STATS.map((s) => (
                <div className="auth__stat" key={s.label}>
                  <span className="auth__stat-value nd-mono">{s.value}</span>
                  <span className="auth__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </blockquote>
        </aside>
      </div>
    </div>
  )
}
