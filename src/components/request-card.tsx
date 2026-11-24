import { Item } from '@/db/schema/items'
import {
  CheckCircleIcon,
  CheckIcon,
  DotsThreeIcon,
  PaperPlaneTiltIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react'
import Image from 'next/image'
import { useState } from 'react'
import { ButtonGroup } from './ui/button-group'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { ChatUI } from './chat-ui'
import {
  approveRentalRequest,
  completeRentalRequest,
  deleteRentalRequest,
  rejectRentalRequest,
} from '@/app/actions/requests'
import { toast } from 'sonner'
import { Request } from '@/db/schema/requests'
import { Conversation } from '@/db/schema/conversations'
import { DisabledButtonTooltip } from './disabled-button-tooltip'
import { CreateReviewDialog } from './create-review-dialog'
import { SealedLiveQuery } from '@neon/realtime/client'
import { MessagesRow } from '@/lib/realtime/messages'

function RequestCard({
  item,
  request,
  conversation,
  userId,
  isOwner,
}: {
  item: Item
  request: Request
  conversation: Conversation
  userId: string
  isOwner?: boolean
}) {
  const [chatOpen, setChatOpen] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [sealedQuery, setSealedQuery] = useState<SealedLiveQuery<MessagesRow> | null>(null)

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

  const handleComplete = async (requestId: string) => {
    try {
      const { success, error } = await completeRentalRequest(requestId)
      if (!success) {
        toast.error(error)
        return
      }
      toast.success('Completion success')
    } catch (error) {
      console.error(error)
      toast.error('Completion failed')
    }
  }

  const handleChatOpen = async () => {
    try {
      const res = await fetch('/api/messages/live-query', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: conversation.id }),
      })

      if (!res.ok) {
        toast.error('Something went wrong')
        return
      }

      const sealedQuery: SealedLiveQuery<MessagesRow> = await res.json()

      setSealedQuery(sealedQuery)
      setChatOpen(true)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="group overflow-hidden rounded-lg border">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          width={1024}
          height={1024}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-muted-foreground text-sm">Rental Request</p>
          </div>
        </div>
        {request.message && (
          <div className="flex flex-col mt-4">
            <span>Message</span>
            <span className="text-muted-foreground bg-muted italic text-sm">{request.message}</span>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex justify-center gap-1">
            <span className="font-medium">{request.duration}</span>
            <span className="text-muted-foreground">{request.durationType}</span>
          </div>
          {isOwner ? (
            <ButtonGroup>
              {request.status == 'approved' ? (
                <DisabledButtonTooltip message="You've already approved">
                  <Button disabled>
                    <CheckCircleIcon />
                    Approved
                  </Button>
                </DisabledButtonTooltip>
              ) : (
                <Button onClick={async () => await handleApprove(request.id)}>
                  <CheckCircleIcon />
                  Approve
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="icon" aria-label="More Options">
                      <DotsThreeIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuGroup>
                    {request.status == 'rejected' ? (
                      <DisabledButtonTooltip message="You've already rejected">
                        <DropdownMenuItem disabled className="text-destructive">
                          <XIcon /> Rejected
                        </DropdownMenuItem>
                      </DisabledButtonTooltip>
                    ) : (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={async () => await handleReject(request.id)}
                      >
                        <XIcon /> Reject
                      </DropdownMenuItem>
                    )}

                    {request.status == 'completed' ? (
                      <DisabledButtonTooltip message="Rental request is already complete">
                        <DropdownMenuItem disabled>
                          <CheckIcon /> Complete
                        </DropdownMenuItem>
                      </DisabledButtonTooltip>
                    ) : (
                      <DropdownMenuItem onClick={async () => await handleComplete(request.id)}>
                        <CheckIcon /> Complete
                      </DropdownMenuItem>
                    )}
                    {request.status == 'completed' ? (
                      <DropdownMenuItem onClick={() => setReviewOpen(true)}>
                        <PencilIcon /> Review
                      </DropdownMenuItem>
                    ) : (
                      <DisabledButtonTooltip message="You can review once rent is complete">
                        <DropdownMenuItem disabled>
                          <PencilIcon /> Review
                        </DropdownMenuItem>
                      </DisabledButtonTooltip>
                    )}
                    {!conversation ? (
                      <DisabledButtonTooltip message="Approve the request to start messaging">
                        <DropdownMenuItem disabled>
                          <PaperPlaneTiltIcon />
                          Message
                        </DropdownMenuItem>
                      </DisabledButtonTooltip>
                    ) : (
                      <DropdownMenuItem onClick={handleChatOpen}>
                        <PaperPlaneTiltIcon />
                        Message
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <ChatUI
                open={chatOpen}
                setOpen={setChatOpen}
                conversationId={conversation?.id}
                item={item}
                userId={userId}
                sealedQuery={sealedQuery}
              />
              <CreateReviewDialog open={reviewOpen} setOpen={setReviewOpen} request={request} />
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <Button variant="destructive" onClick={async () => await handleDelete(request.id)}>
                <TrashIcon />
                Delete
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="icon" aria-label="More Options">
                      <DotsThreeIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuGroup>
                    {!conversation ? (
                      <DisabledButtonTooltip message="You can message after approval">
                        <DropdownMenuItem disabled>
                          <PaperPlaneTiltIcon />
                          Message
                        </DropdownMenuItem>
                      </DisabledButtonTooltip>
                    ) : (
                      <DropdownMenuItem onClick={handleChatOpen}>
                        <PaperPlaneTiltIcon />
                        Message
                      </DropdownMenuItem>
                    )}
                    {request.status == 'completed' ? (
                      <DropdownMenuItem onClick={() => setReviewOpen(true)}>
                        <PencilIcon /> Review
                      </DropdownMenuItem>
                    ) : (
                      <DisabledButtonTooltip message="You can review once rent is complete">
                        <DropdownMenuItem disabled>
                          <PencilIcon /> Review
                        </DropdownMenuItem>
                      </DisabledButtonTooltip>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <ChatUI
                open={chatOpen}
                setOpen={setChatOpen}
                conversationId={conversation?.id}
                item={item}
                userId={userId}
                sealedQuery={sealedQuery}
              />
              <CreateReviewDialog open={reviewOpen} setOpen={setReviewOpen} request={request} />
            </ButtonGroup>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestCard
