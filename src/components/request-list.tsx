'use client'
import { Item } from '@/db/schema/items'
import { Request } from '@/db/schema/requests'
import { Conversation } from '@/db/schema/conversations'
import { Message } from '@/db/schema/messages'
import RequestCard from './request-card'
import RequestFilter from './request-filter'
import Pagination from './pagination'
import { EmptyState } from './empty-state'

function RequestList({
  requests,
  isOwner,
  userId,
}: {
  requests: (Request & { item: Item | null } & {
    conversation: (Conversation & { messages: Message[] }) | null
  })[]
  isOwner?: boolean
  userId: string
}) {
  return (
    <div className="flex-1">
      <RequestFilter />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map(
          (req) =>
            req.item && (
              <RequestCard
                key={req.id}
                conversation={req.conversation as Conversation}
                isOwner={isOwner}
                item={req.item as Item}
                messages={req.conversation?.messages as Message[]}
                request={req}
                userId={userId}
              />
            ),
        )}
      </div>
      {requests.length === 0 && (
        <EmptyState
          title="No Requests Available"
          description="Currently no requests are available"
        />
      )}
      <Pagination nextDisabled={requests.length < 12} />
    </div>
  )
}

export default RequestList
