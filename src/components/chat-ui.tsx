'use client'

import * as React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Bubble, BubbleContent } from '@/components/ui/bubble'
import { Message } from '@/db/schema/messages'
import { Field } from './ui/field'
import { Input } from './ui/input'
import { Item } from '@/db/schema/items'
import { PaperPlaneTiltIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { createMessage } from '@/app/actions/message'

export function ChatUI({
  conversationId,
  messages,
  userId,
  item,
  disabled,
}: {
  conversationId: string
  messages: Message[]
  userId: string
  item: Item
  disabled?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [msgs, setMsgs] = React.useState<Message[]>(messages)
  const [msg, setMsg] = React.useState('')
  const isMobile = useIsMobile()

  const handleSend = async () => {
    if (!msg.trim()) return
    try {
      const res = await createMessage(conversationId, msg.trim())
      setMsg('')
      setMsgs((prev) => [...prev, res.data as Message])
    } catch (error) {
      console.error(error)
      toast.error('Sending failed')
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? 'down' : 'right'}
    >
      <DrawerTrigger
        render={
          <Button disabled={disabled} className="w-full">
            <PaperPlaneTiltIcon />
            Message
          </Button>
        }
      />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Message</DrawerTitle>
          <DrawerDescription>You are messaging owner of {item.name}</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="flex w-full max-w-sm flex-col gap-4 px-4 py-12">
            {msgs.map((message) => (
              <Bubble
                key={message.id}
                variant={message.senderId == userId ? 'default' : 'muted'}
                align={message.senderId == userId ? 'end' : 'start'}
              >
                <BubbleContent>{message.message}</BubbleContent>
              </Bubble>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <div className="flex gap-2">
            <Field>
              <Input
                id="message"
                name="message"
                placeholder="Enter your message..."
                required
                onChange={(e) => setMsg(e.target.value)}
                value={msg}
              />
            </Field>
            <Button size="icon" onClick={handleSend}>
              <PaperPlaneTiltIcon />
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
