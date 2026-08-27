import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import '../profile/profile.css'
import AppNav from '../../components/common/AppNav'
import { PAGE_ROUTES } from '../../routes'
import { selectUser } from '../auth/authSlice'
import { useMeQuery } from '../auth/authApi'

export default function HomePage() {
  const cachedUser = useSelector(selectUser)
  // Confirms the token works end to end against users-service.
  const { data, isLoading, isError } = useMeQuery()
  const user = data || cachedUser
  const isBrand = user?.role === 'brand'

  return (
    <>
      <AppNav />
      <div className="page">
        <h1>Welcome to Ndorsify</h1>
        {isLoading && <p className="subtle">Loading your account…</p>}
        {isError && (
          <p className="form-error" role="alert">
            Could not load your account.
          </p>
        )}
        {user && (
          <div style={{ margin: '12px 0 24px', lineHeight: 1.9 }}>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Role:</strong> {user.role}
            </div>
            <div>
              <strong>Email verified:</strong>{' '}
              {user.email_verified ? 'yes' : 'no'}
            </div>
          </div>
        )}

        <h3 style={{ color: 'var(--ink)' }}>Next steps</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <Link to={PAGE_ROUTES.ONBOARDING}>Complete onboarding</Link>
          </li>
          <li>
            <Link to={PAGE_ROUTES.PROFILE_EDIT}>
              {isBrand ? 'Set up your brand profile' : 'Complete your creator profile'}
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
