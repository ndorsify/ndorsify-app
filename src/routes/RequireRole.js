import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

import { selectUser } from '../features/auth/authSlice'
import { PAGE_ROUTES } from './index'

// Gate for role-specific routes. Must sit inside <RequireAuth> — this only
// checks role, not authentication. An authed user with the wrong role is
// redirected to their dashboard rather than allowed to view a route built
// for the other role (previously only enforced by AppNav hiding the link).
export default function RequireRole({ role }) {
  const user = useSelector(selectUser)

  if (user?.role !== role) {
    return <Navigate to={PAGE_ROUTES.DASHBOARD} replace />
  }
  return <Outlet />
}
