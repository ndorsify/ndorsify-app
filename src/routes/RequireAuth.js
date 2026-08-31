import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { selectIsAuthed, selectUser } from '../features/auth/authSlice'
import { useMeQuery } from '../features/auth/authApi'
import { PAGE_ROUTES } from './index'

// Gate for protected routes: redirect to /login (remembering where we came from).
export default function RequireAuth() {
  const authed = useSelector(selectIsAuthed)
  const user = useSelector(selectUser)
  const location = useLocation()

  // On a fresh boot (or a reload) only the persisted refresh token survives —
  // `user` isn't known yet. Fetch it here, once, before any nested route
  // (role gates in particular) makes a decision based on a still-null user.
  useMeQuery(undefined, { skip: !authed || Boolean(user) })

  if (!authed) {
    return (
      <Navigate to={PAGE_ROUTES.LOGIN} replace state={{ from: location }} />
    )
  }
  // Wait rather than let a nested role gate decide on a still-null user. If
  // the /me fetch fails (e.g. an invalid refresh token), the reauth wrapper
  // dispatches loggedOut(), authed flips false, and the branch above takes
  // over — so this can't strand the user in a permanent blank screen.
  if (!user) {
    return null
  }
  return <Outlet />
}
