import './campaigns.css'
import '../profile/profile.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import {
  useMyInvitationsQuery,
  useRespondInvitationMutation
} from './campaignApi'

const ORANGE = '#FF914D'

export default function InvitationsPage() {
  const { data: invitations = [], isLoading } = useMyInvitationsQuery()
  const [respond] = useRespondInvitationMutation()

  return (
    <>
      <AppNav />
      <div className="page">
        <h1>Your invitations</h1>
        <p className="subtle">Campaigns brands have invited you to.</p>

        {isLoading && <p className="muted">Loading…</p>}
        {!isLoading && invitations.length === 0 && (
          <p className="muted">No invitations yet.</p>
        )}
        {invitations.map((i) => (
          <div className="campaign-card" key={i.id}>
            <h3>
              Campaign #{i.campaign_id}{' '}
              <span className={`badge ${i.status}`}>{i.status}</span>
            </h3>
            {i.message && <div className="meta">{i.message}</div>}
            {i.status === 'pending' && (
              <div className="row-actions">
                <Button type="button" color={ORANGE} primary size="small" label="Accept"
                  onClick={() => respond({ invitationId: i.id, decision: 'accepted' })} />
                <Button type="button" color="#b23b3b" size="small" label="Decline"
                  onClick={() => respond({ invitationId: i.id, decision: 'declined' })} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
