import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

import './auth.css'
import { apiErrorMessage } from '../../lib/errors'
import { PAGE_ROUTES } from '../../routes'
import { useOauthCompleteMutation, useOauthExchangeMutation } from './authApi'

// Same two roles the signup page offers — Google can't tell us which one.
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

const landingFor = (role) =>
  role === 'creator' ? PAGE_ROUTES.ONBOARDING : PAGE_ROUTES.DASHBOARD

/**
 * Where Google sends the browser back to.
 *
 * `handoff` means the account exists — trade it for a session and get out of
 * the way. `signup` means it doesn't: the provider gave us an identity, not a
 * role, so nothing has been created yet and we have to ask.
 */
export default function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const handoff = params.get('handoff')
  const signup = params.get('signup')

  const [exchange] = useOauthExchangeMutation()
  const [complete, { isLoading: isCreating }] = useOauthCompleteMutation()
  const [role, setRole] = useState('brand')
  const [error, setError] = useState('')
  const exchanged = useRef(false)

  useEffect(() => {
    if (!handoff || exchanged.current) return
    // Strict mode runs effects twice; the handoff is single-use.
    exchanged.current = true
    exchange(handoff)
      .unwrap()
      .then(() => navigate(PAGE_ROUTES.DASHBOARD, { replace: true }))
      .catch((err) =>
        setError(apiErrorMessage(err, 'That sign-in link is no longer valid.'))
      )
  }, [handoff, exchange, navigate])

  const onChooseRole = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { user } = await complete({ signup, role }).unwrap()
      navigate(landingFor(user.role), { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not finish creating your account.'))
    }
  }

  const failed = (!handoff && !signup) || error

  return (
    <div className="auth">
      <div className="auth__panel">
        <div className="auth__main">
          <Link to={PAGE_ROUTES.HOME} className="auth__brand">
            <span className="nd-brand__mark" />
            <span className="nd-brand__word">Ndorsify</span>
          </Link>

          {failed && (
            <>
              <div className="auth__head">
                <h1 className="nd-h1">That didn't work</h1>
                <p className="nd-sub" role="alert">
                  {error || 'This sign-in link is missing something. Start again.'}
                </p>
              </div>
              <Link className="nd-btn nd-btn--primary" to={PAGE_ROUTES.LOGIN}>
                Back to sign in
              </Link>
            </>
          )}

          {!failed && handoff && (
            <div className="auth__head">
              <h1 className="nd-h1">Signing you in…</h1>
              <p className="nd-sub">One moment.</p>
            </div>
          )}

          {!failed && signup && (
            <>
              <div className="auth__head">
                <h1 className="nd-h1">How will you use Ndorsify?</h1>
                <p className="nd-sub">
                  Google confirmed who you are — this is the one thing it can't
                  tell us. Your account is created once you choose.
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

              <form className="auth__form" onSubmit={onChooseRole}>
                <button
                  className="nd-btn nd-btn--primary"
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating your account…' : 'Create my account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
