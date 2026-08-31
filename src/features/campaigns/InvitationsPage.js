import { Link } from 'react-router-dom'

import './campaigns.css'
import AppNav from '../../components/common/AppNav'
import { Avatar, SampleBanner } from '../../components/common/ds'
import { PAGE_ROUTES, buildPath } from '../../routes'
import {
  useMyInvitationsQuery,
  useRespondInvitationMutation
} from './campaignApi'
import { sampleInvites } from '../../lib/sampleData'

export default function InvitationsPage() {
  const { data: invitations = [], isLoading } = useMyInvitationsQuery()
  const [respond] = useRespondInvitationMutation()
  const usingSample = !isLoading && invitations.length === 0

  return (
    <>
      <AppNav />
      <div className="nd-page">
        <div className="nd-page-head">
          <div className="nd-page-head__titles">
            <h1 className="nd-h1">Your invitations</h1>
            <p className="nd-sub">Campaigns brands have invited you to.</p>
          </div>
        </div>

        {isLoading && <div className="nd-empty">Loading…</div>}

        {usingSample ? (
          <>
            <div style={{ marginBottom: 14 }}>
              <SampleBanner>
                Sample invitations — live invites appear here as brands reach
                out.
              </SampleBanner>
            </div>
            {sampleInvites.map((s, idx) => (
              <div
                className="nd-card"
                style={{ marginBottom: 12 }}
                key={s.brand}
              >
                <div
                  className="nd-between"
                  style={{ alignItems: 'flex-start' }}
                >
                  <div
                    className="nd-row"
                    style={{ alignItems: 'flex-start', gap: 12 }}
                  >
                    <Avatar label={s.logo} size={40} square />
                    <div>
                      <div className="nd-row" style={{ gap: 7 }}>
                        <span className="nd-h2">{s.brand}</span>
                        <span className="nd-pill nd-pill--success">
                          {s.fit}
                        </span>
                      </div>
                      <div
                        className="nd-muted"
                        style={{ fontSize: '0.8rem', marginTop: 4 }}
                      >
                        {s.campaign} · {s.deliverables}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={buildPath(PAGE_ROUTES.INVITATION_DETAIL, {
                      id: idx + 1
                    })}
                    className="nd-btn nd-btn--primary nd-btn--sm"
                  >
                    Review offer
                  </Link>
                </div>
              </div>
            ))}
          </>
        ) : (
          invitations.map((i) => (
            <div className="nd-card" style={{ marginBottom: 12 }} key={i.id}>
              <div className="nd-between" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div className="nd-row" style={{ gap: 8 }}>
                    <span className="nd-h2">Campaign #{i.campaign_id}</span>
                    <span className={`badge ${i.status}`}>{i.status}</span>
                  </div>
                  {i.message && (
                    <div
                      className="nd-muted"
                      style={{ fontSize: '0.8rem', marginTop: 4 }}
                    >
                      {i.message}
                    </div>
                  )}
                </div>
                <div className="nd-row" style={{ gap: 8 }}>
                  <Link
                    to={buildPath(PAGE_ROUTES.INVITATION_DETAIL, { id: i.id })}
                    className="nd-btn nd-btn--secondary nd-btn--sm"
                  >
                    Review
                  </Link>
                  {i.status === 'pending' && (
                    <>
                      <button
                        className="nd-btn nd-btn--primary nd-btn--sm"
                        onClick={() =>
                          respond({ invitationId: i.id, decision: 'accepted' })
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="nd-btn nd-btn--danger nd-btn--sm"
                        onClick={() =>
                          respond({ invitationId: i.id, decision: 'declined' })
                        }
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
