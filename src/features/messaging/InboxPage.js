import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import './messaging.css'
import '../profile/profile.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import { selectUser } from '../auth/authSlice'
import {
  useCreateConversationMutation,
  useListConversationsQuery
} from './messagingApi'

const ORANGE = '#FF914D'

export default function InboxPage() {
  const navigate = useNavigate()
  const me = useSelector(selectUser)?.id
  const { data: conversations = [], isLoading } = useListConversationsQuery()
  const [createConversation, { isLoading: creating }] =
    useCreateConversationMutation()
  const [recipient, setRecipient] = useState('')

  const otherParticipant = (c) =>
    c.participant_a === me ? c.participant_b : c.participant_a

  const onStart = async (e) => {
    e.preventDefault()
    const id = parseInt(recipient, 10)
    if (!id) return
    try {
      const convo = await createConversation(id).unwrap()
      navigate(`/messages/${convo.id}`)
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <AppNav />
      <div className="page">
        <h1>Messages</h1>

        <form className="new-message" onSubmit={onStart}>
          <input
            placeholder="Start a conversation — recipient user id"
            type="number"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <Button
            type="submit"
            color={ORANGE}
            primary
            size="medium"
            label={creating ? 'Starting…' : 'Start'}
          />
        </form>

        {isLoading && <p className="muted">Loading conversations…</p>}
        {!isLoading && conversations.length === 0 && (
          <p className="muted">No conversations yet.</p>
        )}
        {conversations.map((c) => (
          <Link className="convo-row" to={`/messages/${c.id}`} key={c.id}>
            <div>Conversation with user #{otherParticipant(c)}</div>
            <div className="when">
              {c.last_message_at
                ? new Date(c.last_message_at).toLocaleString()
                : 'No messages yet'}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
