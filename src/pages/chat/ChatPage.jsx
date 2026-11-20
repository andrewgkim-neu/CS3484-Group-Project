import { useParams } from 'react-router'
import { Placeholder } from '../../components'

/** /chat (conversation list) and /chat/:userId (thread with that user). */
export default function ChatPage() {
  const { userId } = useParams()
  return (
    <Placeholder
      title="Messages"
      owner="Christina"
      todo={[
        'Conversation list (getConversations)',
        'Thread with the user from the URL (getOrCreateConversation(me, userId))',
        'Send messages (sendMessage)',
        'Referral requests as a structured message (sendReferralRequest, respondToReferral)',
      ]}
    >
      <p className="text-muted">
        URL param <code>userId</code> = <code>{userId ?? '(none: show conversation list)'}</code>
      </p>
    </Placeholder>
  )
}
