import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { selectIsAuthed } from '../features/auth/authSlice'
import { PAGE_ROUTES } from './index'

// Gate for protected routes: redirect to /login (remembering where we came from).
export default function RequireAuth() {
  const authed = useSelector(selectIsAuthed)
  const location = useLocation()

  if (!authed) {
    return (
      <Navigate to={PAGE_ROUTES.LOGIN} replace state={{ from: location }} />
    )
  }
  return <Outlet />
}
