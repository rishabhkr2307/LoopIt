import { Item } from '@/db/schema/items'
import {
  CheckIcon,
  DotsThreeIcon,
  PaperPlaneTiltIcon,
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
  deleteRentalRequest,
  rejectRentalRequest,
} from '@/app/actions/requests'
import { toast } from 'sonner'
import { Request } from '@/db/schema/requests'
import { Message } from '@/db/schema/messages'
import { Conversation } from '@/db/schema/conversations'

function RequestCard({
  item,
  request,
  messages,
  conversation,
  userId,
  isOwner,
}: {
  item: Item
  request: Request
  messages: Message[]
  conversation: Conversation
  userId: string
  isOwner?: boolean
}) {
  const [chatOpen, setChatOpen] = useState(false)

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

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">${item.pricePerDay}</span>
            <span className="text-muted-foreground text-sm">Per Day</span>
          </div>
          {isOwner ? (
            <ButtonGroup>
              <Button
                disabled={request.status == 'approved'}
                onClick={async () => await handleApprove(request.id)}
              >
                <CheckIcon />
                {request.status == 'approved' ? 'Approved' : 'Approve'}
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
                    <DropdownMenuItem
                      disabled={request.status == 'rejected'}
                      className="text-destructive"
                      onClick={async () => await handleReject(request.id)}
                    >
                      <XIcon /> {request.status == 'rejected' ? 'Rejected' : 'Reject'}
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={!conversation} onClick={() => setChatOpen(true)}>
                      <PaperPlaneTiltIcon />
                      Message
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <ChatUI
                open={chatOpen}
                setOpen={setChatOpen}
                conversationId={conversation.id}
                item={item}
                messages={messages}
                userId={userId}
              />
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
                    <DropdownMenuItem onClick={() => setChatOpen(true)} disabled={!conversation}>
                      <PaperPlaneTiltIcon />
                      Message
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <ChatUI
                open={chatOpen}
                setOpen={setChatOpen}
                conversationId={conversation?.id}
                item={item}
                messages={messages ?? []}
                userId={userId}
              />
            </ButtonGroup>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestCard
