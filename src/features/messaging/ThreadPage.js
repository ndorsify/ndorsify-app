import { useParams } from 'react-router-dom'

import MessagesLayout from './MessagesLayout'

export default function ThreadPage() {
  const { id } = useParams()
  return <MessagesLayout activeId={id} />
}
