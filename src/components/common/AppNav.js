import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import logo from '../../assets/siteLogo.png'
import { PAGE_ROUTES } from '../../routes'
import {
  loggedOut,
  selectRefreshToken,
  selectUser
} from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApi'
import './appNav.css'

// Top nav for authenticated pages.
export default function AppNav() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const refreshToken = useSelector(selectRefreshToken)
  const isBrand = useSelector(selectUser)?.role === 'brand'
  const [logout] = useLogoutMutation()

  const onLogout = async () => {
    try {
      if (refreshToken) await logout({ refresh_token: refreshToken }).unwrap()
    } catch {
      /* log out locally regardless */
    }
    dispatch(loggedOut())
    navigate(PAGE_ROUTES.LOGIN, { replace: true })
  }

  const link = (to, label) => (
    <Link
      to={to}
      className={location.pathname === to ? 'appnav-link active' : 'appnav-link'}
    >
      {label}
    </Link>
  )

  return (
    <nav className="appnav">
      <Link to={PAGE_ROUTES.HOME} className="appnav-brand">
        <img src={logo} alt="Ndorsify" />
      </Link>
      <div className="appnav-links">
        {link(PAGE_ROUTES.HOME, 'Home')}
        {isBrand && link(PAGE_ROUTES.DISCOVER, 'Discover')}
        {link(PAGE_ROUTES.MESSAGES, 'Messages')}
        {link(PAGE_ROUTES.PROFILE_EDIT, 'Profile')}
        <button type="button" className="appnav-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </nav>
  )
}
