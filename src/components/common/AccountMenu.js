import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Avatar } from './ds'

const ProfileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const SettingsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const LogoutIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

// Account dropdown in the header — replaces the old inert avatar span + bare
// top-level logout button with a real menu (Profile, Settings, Log out).
export default function AccountMenu({
  name,
  email,
  initials,
  avatarSrc,
  profileHref,
  settingsHref,
  onLogout
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onMouseDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => setOpen(false)

  return (
    <div className="nd-account" ref={rootRef}>
      <button
        type="button"
        className="nd-account__trigger"
        ref={triggerRef}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar label={initials} src={avatarSrc} size={32} />
      </button>
      {open && (
        <div className="nd-account__panel" role="menu">
          <div className="nd-account__header">
            {name && <div className="nd-account__name">{name}</div>}
            <div className="nd-account__email">{email}</div>
          </div>
          <div className="nd-account__divider" />
          <Link
            to={profileHref}
            className="nd-account__item"
            role="menuitem"
            onClick={close}
          >
            <span className="nd-account__icon">
              <ProfileIcon />
            </span>
            Profile
          </Link>
          <Link
            to={settingsHref}
            className="nd-account__item"
            role="menuitem"
            onClick={close}
          >
            <span className="nd-account__icon">
              <SettingsIcon />
            </span>
            Settings
          </Link>
          <div className="nd-account__divider" />
          <button
            type="button"
            className="nd-account__item"
            role="menuitem"
            onClick={() => {
              close()
              onLogout()
            }}
          >
            <span className="nd-account__icon">
              <LogoutIcon />
            </span>
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
