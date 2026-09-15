import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { PAGE_ROUTES } from '../../routes'
import { apiErrorMessage } from '../../lib/errors'
import { useCompleteSocialConnectMutation } from './profileApi'

/**
 * Where a social provider drops the browser after the creator authorizes.
 *
 * Public on purpose: the redirect is a full page load, which discards the
 * in-memory access token, so this screen can't depend on being authenticated.
 * profile-service authenticates the callback off the signed `state` instead.
 */
export default function SocialCallbackPage() {
  const { platform } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [completeConnect] = useCompleteSocialConnectMutation()
  const [error, setError] = useState(null)

  // React 18 StrictMode double-invokes effects in development; `state` is
  // single-use, so a second call would fail against an already-spent token.
  const started = useRef(false)

  const state = params.get('state')
  const externalAccountId = params.get('external_account_id')

  useEffect(() => {
    if (started.current) return
    started.current = true

    if (!state || !externalAccountId) {
      setError('This connection link is missing information. Please try again.')
      return
    }

    completeConnect({ platform, state, externalAccountId })
      .unwrap()
      .then(() => navigate(PAGE_ROUTES.PROFILE_EDIT, { replace: true }))
      .catch((err) => setError(apiErrorMessage(err)))
  }, [completeConnect, externalAccountId, navigate, platform, state])

  return (
    <div className="nd-page nd-page--narrow">
      <div className="nd-card nd-stack" style={{ gap: 12 }}>
        <div className="nd-h3">
          {error ? 'Could not connect that account' : `Connecting ${platform}…`}
        </div>
        {error ? (
          <>
            <p className="nd-error">{error}</p>
            <button
              className="nd-btn nd-btn--primary nd-btn--sm"
              onClick={() => navigate(PAGE_ROUTES.PROFILE_EDIT, { replace: true })}
              type="button"
            >
              Back to profile
            </button>
          </>
        ) : (
          <p className="nd-muted">Pulling in your latest follower numbers.</p>
        )}
      </div>
    </div>
  )
}
