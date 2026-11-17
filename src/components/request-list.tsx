'use client'
import { Item } from '@/db/schema/items'
import { Request } from '@/db/schema/requests'
import { Button } from './ui/button'
import {
  approveRentalRequest,
  deleteRentalRequest,
  rejectRentalRequest,
} from '@/app/actions/requests'
import { toast } from 'sonner'
import Image from 'next/image'
import { CheckIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { ChatUI } from './chat-ui'
import { Conversation } from '@/db/schema/conversations'
import { Message } from '@/db/schema/messages'

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
  const handleReject = async (requestId: string) => {
    try {
      const { success, error } = await rejectRentalRequest(requestId)
      if (!success) {
        toast.error(error)
        return
      }
      toast.success('Rejection success')
    } catch (error) {
      console.error(error)
      toast.error('Rejection failed')
    }
  }

  const handleApprove = async (requestId: string) => {
    try {
      const { success, error } = await approveRentalRequest(requestId)
      if (!success) {
        toast.error(error)
        return
      }
      toast.success('Approval success')
    } catch (error) {
      console.error(error)
      toast.error('Approval failed')
    }
  }

  const handleDelete = async (requestId: string) => {
    try {
      const { success, error } = await deleteRentalRequest(requestId)
      if (!success) {
        toast.error(error)
        return
      }
      toast.success('Deletion success')
    } catch (error) {
      console.error(error)
      toast.error('Deletion failed')
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <div className="text-muted-foreground mb-4 text-sm">{requests.length} items found</div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map(
              (req) =>
                req.item && (
                  <div key={req.id} className="group overflow-hidden rounded-lg border">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={req.item.imageUrl}
                        alt={req.item.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        width={1024}
                        height={1024}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium">{req.item.name}</h3>
                          <p className="text-muted-foreground text-sm">Rental Request</p>
                        </div>
                        {isOwner ? (
                          <div className="w-full grid grid-cols-2 mt-4">
                            <Button
                              disabled={req.status == 'rejected'}
                              variant="destructive"
                              onClick={async () => await handleReject(req.id)}
                            >
                              <XIcon />
                              Reject
                            </Button>
                            <Button
                              disabled={req.status == 'approved'}
                              onClick={async () => await handleApprove(req.id)}
                            >
                              <CheckIcon />
                              Approve
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full mt-4">
                            <Button
                              variant="destructive"
                              onClick={async () => await handleDelete(req.id)}
                              className="w-full"
                            >
                              <TrashIcon />
                              Delete
                            </Button>
                            <ChatUI
                              disabled={!req.conversation}
                              conversationId={req.conversation?.id ?? ''}
                              item={req.item!}
                              messages={req.conversation?.messages ?? []}
                              userId={userId}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestList
