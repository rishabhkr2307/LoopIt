'use client'
import { Item } from '@/db/schema/items'
import { Request } from '@/db/schema/requests'
import { Conversation } from '@/db/schema/conversations'
import { Message } from '@/db/schema/messages'
import RequestCard from './request-card'

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
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="text-muted-foreground mb-4 text-sm">{requests.length} items found</div>
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
        </div>
      </div>
    </div>
  )
}

export default RequestList
