import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import './auth.css'
import { apiErrorMessage } from '../../lib/errors'
import { PAGE_ROUTES } from '../../routes'
import GoogleButton from './GoogleButton'
import { useRegisterMutation } from './authApi'

// Exact copy from the Ndorsify design system (artboard 3a).
const ROLE_CARDS = [
  {
    id: 'brand',
    title: "I'm a Brand",
    body: 'Search creators, send offers, run campaigns and pay through escrow.',
    tags: ['Discovery', 'Campaign briefs', 'Reporting']
  },
  {
    id: 'creator',
    title: "I'm a Creator",
    body: 'Publish a rate card, get matched to briefs, negotiate and get paid on time.',
    tags: ['Free forever', 'No commission', 'Rate card']
  }
]

const SIGNUP_STEPS = [
  {
    num: '1',
    title: 'Verify your email',
    body: 'One click from your inbox — takes about a minute.'
  },
  {
    num: '2',
    title: 'Tell us your category',
    body: 'We use it to seed your first discovery results and creator suggestions.'
  },
  {
    num: '3',
    title: 'Invite your team',
    body: 'Marketing, finance and legal each get the right permissions.'
  },
  {
    num: '4',
    title: 'Post your first brief',
    body: "Free to publish. You only fund escrow once you're ready to send invites."
  }
]

const STATS = [
  { value: '12,480', label: 'creators' },
  { value: '$38M', label: 'paid out' },
  { value: '4.9/5', label: 'brand rating' }
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState(location.state?.role || 'brand')
  const [register, { isLoading, error }] = useRegisterMutation()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({ email, password, role }).unwrap()
      navigate(
        role === 'creator' ? PAGE_ROUTES.ONBOARDING : PAGE_ROUTES.DASHBOARD,
        { replace: true }
      )
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
            <h1 className="nd-h1">Create your account</h1>
            <p className="nd-sub">
              Pick how you'll use Ndorsify. You can add the other role later
              from settings.
            </p>
          </div>

          <div className="auth__roles">
            {ROLE_CARDS.map((r) => (
              <button
                key={r.id}
                type="button"
                className={role === r.id ? 'auth__role is-on' : 'auth__role'}
                onClick={() => setRole(r.id)}
                aria-pressed={role === r.id}
              >
                <span className="auth__radio" aria-hidden />
                <span className="auth__role-body">
                  <span className="auth__role-title">{r.title}</span>
                  <span className="auth__role-sub">{r.body}</span>
                  <span className="auth__tags">
                    {r.tags.map((t) => (
                      <span className="auth__tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <GoogleButton label="Sign up with Google" />
          <div className="auth__or">or</div>
          <form className="auth__form" onSubmit={onSubmit}>
            <div className={role === 'brand' ? 'auth__fields2' : ''}>
              <label className="nd-field">
                <span>{role === 'brand' ? 'Work email' : 'Email'}</span>
                <input
                  className="nd-input"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === 'brand' ? 'you@company.com' : 'you@email.com'
                  }
                />
              </label>
              {role === 'brand' && (
                <label className="nd-field">
                  <span>Company</span>
                  <input
                    className="nd-input"
                    name="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Kettle & Fern"
                  />
                </label>
              )}
            </div>
            <label className="nd-field">
              <span>Password</span>
              <div className="auth__pass">
                <input
                  className="nd-input"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
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
                {apiErrorMessage(error)}
              </p>
            )}
            <button
              type="submit"
              className="nd-btn nd-btn--primary nd-btn--lg nd-btn--block"
              disabled={isLoading}
            >
              {isLoading ? 'Creating…' : `Create ${role} account`}
            </button>
            <p className="auth__terms">
              By continuing you agree to the Terms and the Creator Agreement.
            </p>
          </form>
          <p className="auth__links">
            Already have an account? <Link to={PAGE_ROUTES.LOGIN}>Sign in</Link>
          </p>
        </div>

        <aside className="auth__side">
          <div className="auth__side-top">
            <span className="nd-eyebrow">What happens next</span>
            <div className="auth__steps">
              {SIGNUP_STEPS.map((s) => (
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
              “Onboarding took twenty minutes. Our first brief was live the same
              afternoon.”
            </span>
            <div className="auth__author">
              <span className="auth__author-avatar" aria-hidden />
              <div className="nd-stack" style={{ gap: 1 }}>
                <span className="auth__author-name">Tomas Reyner</span>
                <span className="auth__author-role">
                  Brand Marketing, Perch
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
