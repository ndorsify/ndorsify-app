import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import './messaging.css'
import AppNav from '../../components/common/AppNav'
import { Avatar } from '../../components/common/ds'
import { PAGE_ROUTES, buildPath } from '../../routes'
import { selectUser } from '../auth/authSlice'
import { useGetCreatorQuery } from '../discovery/discoveryApi'
import {
  useGetMessagesQuery,
  useListConversationsQuery,
  useMarkReadMutation,
  useSendMessageMutation
} from './messagingApi'

const otherParticipant = (conv, me) =>
  conv.participant_a === me ? conv.participant_b : conv.participant_a

// Resolve a participant id to a display identity. The discovery index covers
// creators; anyone else (e.g. a brand) falls back to a generic label.
function useCounterpart(userId) {
  const { data } = useGetCreatorQuery(userId, { skip: !userId })
  const name = data?.display_name || `User #${userId}`
  return {
    id: userId,
    name,
    initials: name.slice(0, 2).toUpperCase(),
    isCreator: Boolean(data),
    niche: (data?.niches || [])[0] || null
  }
}

const timeLabel = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const today = new Date()
  const sameDay = d.toDateString() === today.toDateString()
  return sameDay
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function ConversationRow({ conv, me, isActive, onClick }) {
  const other = useCounterpart(otherParticipant(conv, me))
  return (
    <button
      className={isActive ? 'ms__thread is-active' : 'ms__thread'}
      onClick={onClick}
    >
      <Avatar label={other.initials} size={40} />
      <div className="nd-grow" style={{ minWidth: 0, textAlign: 'left' }}>
        <div className="nd-between" style={{ gap: 8 }}>
          <span
            className="nd-h3"
            style={{
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {other.name}
          </span>
          <span
            className="nd-mono nd-muted"
            style={{ fontSize: '0.62rem', flex: 'none' }}
          >
            {timeLabel(conv.last_message_at)}
          </span>
        </div>
        <div className="ms__preview">
          {conv.last_message_at ? 'Open to read the latest' : 'No messages yet'}
        </div>
      </div>
    </button>
  )
}

export default function MessagesLayout({ activeId }) {
  const navigate = useNavigate()
  const me = useSelector(selectUser)?.id

  const { data: conversations = [], isLoading } = useListConversationsQuery()

  const numericActive = activeId ? Number(activeId) : null
  // A specific thread was requested (ThreadPage) — match it exactly, or wait
  // (null, not an arbitrary conversation) until the list catches up, e.g.
  // right after creating a brand-new conversation. Only the bare inbox
  // (InboxPage, no activeId) defaults to the first conversation.
  const activeConv = numericActive
    ? conversations.find((c) => c.id === numericActive) || null
    : conversations[0] || null
  const activeConvId = activeConv?.id ?? null

  const counterpart = useCounterpart(
    activeConv ? otherParticipant(activeConv, me) : null
  )

  const { data: liveMessages = [] } = useGetMessagesQuery(activeConvId, {
    skip: !activeConvId
  })
  const [markRead] = useMarkReadMutation()
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation()
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)

  // Mark the open conversation read whenever it changes or new messages land.
  useEffect(() => {
    if (activeConvId) markRead(activeConvId)
  }, [activeConvId, liveMessages.length, markRead])

  // Keep the thread scrolled to the newest message.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [liveMessages.length, activeConvId])

  const messages = useMemo(
    () =>
      liveMessages.map((m) => ({
        id: m.id,
        fromMe: m.sender_id === me,
        text: m.body,
        meta: timeLabel(m.created_at)
      })),
    [liveMessages, me]
  )

  const onSend = async (e) => {
    e.preventDefault()
    const body = draft.trim()
    if (!body || !activeConvId) return
    try {
      await sendMessage({ conversationId: activeConvId, body }).unwrap()
      setDraft('')
    } catch {
      /* error kept in the mutation state; leave the draft so it can be retried */
    }
  }

  return (
    <>
      <AppNav />
      <div className="ms ms--2col">
        {/* Inbox list */}
        <aside className="ms__list">
          <div className="ms__list-head">
            <div className="nd-between">
              <div className="nd-h2">Inbox</div>
              <span
                className="nd-pill nd-pill--code"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                {conversations.length}
              </span>
            </div>
          </div>
          <div className="ms__threads">
            {isLoading && (
              <div
                className="nd-muted"
                style={{ padding: 16, fontSize: '0.8rem' }}
              >
                Loading…
              </div>
            )}
            {!isLoading && conversations.length === 0 && (
              <div
                className="nd-muted"
                style={{ padding: 16, fontSize: '0.8rem', lineHeight: 1.55 }}
              >
                No conversations yet. Open a creator’s profile and hit “Message”
                to start one.
              </div>
            )}
            {conversations.map((c) => (
              <ConversationRow
                key={c.id}
                conv={c}
                me={me}
                isActive={activeConv && c.id === activeConv.id}
                onClick={() =>
                  navigate(buildPath(PAGE_ROUTES.MESSAGE_THREAD, { id: c.id }))
                }
              />
            ))}
          </div>
        </aside>

        {/* Thread */}
        <section className="ms__thread-pane">
          {!activeConv ? (
            <div
              className="nd-muted"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                fontSize: '0.85rem'
              }}
            >
              {numericActive && isLoading
                ? 'Loading conversation…'
                : 'Select a conversation to start messaging.'}
            </div>
          ) : (
            <>
              <div className="ms__thread-head">
                <div className="nd-row" style={{ gap: 12 }}>
                  <Avatar label={counterpart.initials} size={40} />
                  <div>
                    <div className="nd-h3" style={{ fontSize: '0.9rem' }}>
                      {counterpart.name}
                    </div>
                    {counterpart.niche && (
                      <div className="nd-muted" style={{ fontSize: '0.72rem' }}>
                        {counterpart.niche}
                      </div>
                    )}
                  </div>
                </div>
                {counterpart.isCreator && (
                  <Link
                    to={buildPath(PAGE_ROUTES.CREATOR_PROFILE, {
                      id: counterpart.id
                    })}
                    className="nd-btn nd-btn--secondary nd-btn--sm"
                  >
                    View profile
                  </Link>
                )}
              </div>

              <div className="ms__messages" ref={scrollRef}>
                {messages.length === 0 && (
                  <div
                    className="nd-muted"
                    style={{
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      marginTop: 20
                    }}
                  >
                    No messages yet — say hello.
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    className={m.fromMe ? 'ms__msg ms__msg--me' : 'ms__msg'}
                    key={m.id}
                  >
                    <div className="ms__bubble">{m.text}</div>
                    <div
                      className="nd-mono nd-muted"
                      style={{ fontSize: '0.62rem' }}
                    >
                      {m.meta}
                    </div>
                  </div>
                ))}
              </div>

              <form className="ms__composer" onSubmit={onSend}>
                <input
                  className="nd-input"
                  placeholder="Write a message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <div className="nd-between">
                  <span />
                  <button
                    className="nd-btn nd-btn--primary nd-btn--sm"
                    type="submit"
                    disabled={sending || !draft.trim()}
                  >
                    {sending ? '…' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </>
  )
}
