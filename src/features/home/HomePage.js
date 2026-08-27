import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/common/button'
import { PAGE_ROUTES } from '../../routes'
import {
  loggedOut,
  selectRefreshToken,
  selectUser
} from '../auth/authSlice'
import { useLogoutMutation, useMeQuery } from '../auth/authApi'

const ORANGE = '#FF914D'

export default function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const refreshToken = useSelector(selectRefreshToken)
  const cachedUser = useSelector(selectUser)

  // Confirms the token works end to end against users-service.
  const { data, isLoading, isError } = useMeQuery()
  const [logout] = useLogoutMutation()

  const user = data || cachedUser

  const onLogout = async () => {
    try {
      if (refreshToken) await logout({ refresh_token: refreshToken }).unwrap()
    } catch {
      /* log out locally regardless */
    }
    dispatch(loggedOut())
    navigate(PAGE_ROUTES.LOGIN, { replace: true })
  }

  return (
    <div style={{ maxWidth: 560, margin: '10vh auto', padding: '0 20px' }}>
      <h1 style={{ color: '#2b2b2b' }}>Welcome to Ndorsify</h1>
      {isLoading && <p>Loading your account…</p>}
      {isError && (
        <p className="auth-error" role="alert">
          Could not load your account.
        </p>
      )}
      {user && (
        <div style={{ margin: '16px 0', lineHeight: 1.8 }}>
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
      <Button
        color={ORANGE}
        primary
        size="large"
        label="Log out"
        onClick={onLogout}
      />
    </div>
  )
}
