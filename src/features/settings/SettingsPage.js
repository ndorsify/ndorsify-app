import { useSelector } from 'react-redux'

import AppNav from '../../components/common/AppNav'
import { selectUser } from '../auth/authSlice'

export default function SettingsPage() {
  const user = useSelector(selectUser)
  return (
    <>
      <AppNav />
      <div className="nd-page nd-page--narrow">
        <div className="nd-page-head">
          <div className="nd-page-head__titles">
            <h1 className="nd-h1">Settings</h1>
            <p className="nd-sub">Your account details.</p>
          </div>
        </div>

        <div className="nd-card nd-stack" style={{ gap: 14 }}>
          <div className="nd-between">
            <span className="nd-muted">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="nd-between">
            <span className="nd-muted">Account type</span>
            <span>{user?.role === 'brand' ? 'Brand' : 'Creator'}</span>
          </div>
          {user?.email_verified != null && (
            <div className="nd-between">
              <span className="nd-muted">Email verification</span>
              <span
                className={
                  user.email_verified
                    ? 'nd-pill nd-pill--success'
                    : 'nd-pill nd-pill--outline'
                }
              >
                {user.email_verified ? 'Verified' : 'Not verified'}
              </span>
            </div>
          )}
        </div>
        <p className="nd-muted" style={{ fontSize: '0.75rem', marginTop: 14 }}>
          Password change — coming soon.
        </p>
      </div>
    </>
  )
}
