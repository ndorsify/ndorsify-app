import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

import './messaging.css'
import '../profile/profile.css'
import AppNav from '../../components/common/AppNav'
import { Button } from '../../components/common/button'
import { selectUser } from '../auth/authSlice'
import {
  useGetMessagesQuery,
  useMarkReadMutation,
  useSendMessageMutation
} from './messagingApi'

const ORANGE = '#FF914D'

export default function ThreadPage() {
  const { id } = useParams()
  const conversationId = Number(id)
  const me = useSelector(selectUser)?.id

  const { data: messages = [], isLoading } = useGetMessagesQuery(conversationId)
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation()
  const [markRead] = useMarkReadMutation()
  const [body, setBody] = useState('')

  // Mark the thread read whenever we open it or new messages arrive.
  useEffect(() => {
    if (conversationId) markRead(conversationId)
  }, [conversationId, messages.length, markRead])

  const onSend = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    try {
      await sendMessage({ conversationId, body: body.trim() }).unwrap()
      setBody('')
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <AppNav />
      <div className="page">
        <Link to="/messages" className="muted">
          ← Back to inbox
        </Link>
        <h1>Conversation</h1>

        {isLoading && <p className="muted">Loading…</p>}
        <div className="thread">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`bubble ${m.sender_id === me ? 'mine' : 'theirs'}`}
            >
              {m.body}
            </div>
          ))}
          {!isLoading && messages.length === 0 && (
            <p className="muted">No messages yet — say hello.</p>
          )}
        </div>

        <form className="composer" onSubmit={onSend}>
          <input
            placeholder="Write a message…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button
            type="submit"
            color={ORANGE}
            primary
            size="medium"
            label={sending ? '…' : 'Send'}
          />
        </form>
      </div>
    </>
  )
}
