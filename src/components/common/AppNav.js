import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { PAGE_ROUTES } from '../../routes'
import {
  loggedOut,
  selectRefreshToken,
  selectUser
} from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApi'
import {
  useGetBrandProfileQuery,
  useGetCreatorProfileQuery
} from '../../features/profile/profileApi'
import AccountMenu from './AccountMenu'
import './appNav.css'

// "Rachel Oyelaran" -> "RO"; "Kettle & Fern Co" -> "KF" (symbol-only words like
// "&" are skipped); single-word names use the first two letters.
function getInitials(name) {
  if (!name) return null
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((p) => /[a-z0-9]/i.test(p))
  if (parts.length === 0) return null
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// Brand mark: indigo rounded square + wordmark, matching the design system.
export function Brandmark({ role }) {
  return (
    <Link to={PAGE_ROUTES.DASHBOARD} className="nd-brand">
      <span className="nd-brand__mark" aria-hidden="true" />
      <span className="nd-brand__word">Ndorsify</span>
      {role && <span className="nd-brand__role">{role.toUpperCase()}</span>}
    </Link>
  )
}

// Top nav for authenticated pages — role-aware, indigo theme.
export default function AppNav() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector(selectUser)
  const refreshToken = useSelector(selectRefreshToken)
  const isBrand = user?.role === 'brand'
  const [logout] = useLogoutMutation()

  const { data: creatorProfile } = useGetCreatorProfileQuery(user?.id, {
    skip: !user?.id || isBrand
  })
  const { data: brandProfile } = useGetBrandProfileQuery(user?.id, {
    skip: !user?.id || !isBrand
  })
  const displayName = isBrand
    ? brandProfile?.company_name || null
    : creatorProfile?.display_name || null
  const avatarSrc = isBrand
    ? brandProfile?.logo_url || undefined
    : creatorProfile?.avatar_url || undefined

  const onLogout = async () => {
    try {
      if (refreshToken) await logout({ refresh_token: refreshToken }).unwrap()
    } catch {
      /* log out locally regardless */
    }
    dispatch(loggedOut())
    navigate(PAGE_ROUTES.LOGIN, { replace: true })
  }

  const link = (to, label) => {
    const active =
      to === PAGE_ROUTES.DASHBOARD
        ? location.pathname === to
        : location.pathname.startsWith(to)
    return (
      <Link
        to={to}
        className={active ? 'nd-nav__link is-active' : 'nd-nav__link'}
      >
        {label}
      </Link>
    )
  }

  const brandLinks = (
    <>
      {link(PAGE_ROUTES.DASHBOARD, 'Dashboard')}
      {link(PAGE_ROUTES.DISCOVER, 'Discover')}
      {link(PAGE_ROUTES.CAMPAIGNS, 'Campaigns')}
      {link(PAGE_ROUTES.MESSAGES, 'Messages')}
      {link(PAGE_ROUTES.COLLABORATIONS, 'Reports')}
    </>
  )

  const creatorLinks = (
    <>
      {link(PAGE_ROUTES.DASHBOARD, 'Opportunities')}
      {link(PAGE_ROUTES.MARKETPLACE, 'Marketplace')}
      {link(PAGE_ROUTES.INVITATIONS, 'Invitations')}
      {link(PAGE_ROUTES.COLLABORATIONS, 'My deals')}
      {link(PAGE_ROUTES.MESSAGES, 'Messages')}
      {link(PAGE_ROUTES.EARNINGS, 'Earnings')}
      {link(PAGE_ROUTES.PROFILE_EDIT, 'Profile')}
    </>
  )

  const initials =
    getInitials(displayName) || (user?.email || 'ND').slice(0, 2).toUpperCase()

  return (
    <nav className="nd-topnav">
      <div className="nd-topnav__left">
        <Brandmark role={user?.role} />
        <div className="nd-nav">{isBrand ? brandLinks : creatorLinks}</div>
      </div>
      <div className="nd-topnav__right">
        {isBrand ? (
          <Link
            to={PAGE_ROUTES.CAMPAIGN_NEW}
            className="nd-btn nd-btn--primary nd-btn--sm"
          >
            New campaign
          </Link>
        ) : (
          <span className="nd-avail">
            <span className="nd-dot" />
            Open to work
          </span>
        )}
        <AccountMenu
          name={displayName}
          email={user?.email}
          initials={initials}
          avatarSrc={avatarSrc}
          profileHref={PAGE_ROUTES.PROFILE_EDIT}
          settingsHref={PAGE_ROUTES.SETTINGS}
          onLogout={onLogout}
        />
      </div>
    </nav>
  )
}
