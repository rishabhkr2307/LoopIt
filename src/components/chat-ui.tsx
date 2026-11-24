'use client'

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
import { Field } from './ui/field'
import { Input } from './ui/input'
import { Item } from '@/db/schema/items'
import { PaperPlaneTiltIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { createMessage } from '@/app/actions/message'
import { Dispatch, SetStateAction, useState } from 'react'
import { SealedLiveQuery } from '@neon/realtime/server'
import { RealtimeProvider, useLiveQuery } from '@neon/realtime-react'
import { MessagesRow } from '@/lib/realtime/messages'
import { createRealtimeClient } from '@neon/realtime/client'

export function ChatUI({
  open,
  setOpen,
  conversationId,
  userId,
  item,
  sealedQuery,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  conversationId: string
  userId: string
  item: Item
  disabled?: boolean
  sealedQuery: SealedLiveQuery<MessagesRow> | null
}) {
  const isMobile = useIsMobile()
  const [client] = useState(() =>
    createRealtimeClient({
      url: process.env.NEXT_PUBLIC_NEON_REALTIME_WSS_URL!,
    }),
  )
  const [msg, setMsg] = useState('')

  const handleSend = async () => {
    if (!msg.trim() || !conversationId) return
    setMsg('')
    try {
      await createMessage(conversationId, msg.trim())
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
      <DrawerTrigger hidden />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Message</DrawerTitle>
          <DrawerDescription>You are messaging owner of {item.name}</DrawerDescription>
        </DrawerHeader>
        <RealtimeProvider client={client}>
          {sealedQuery && (
            <LiveMessages
              conversationId={conversationId}
              sealedQuery={sealedQuery!}
              userId={userId}
            />
          )}
        </RealtimeProvider>
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
                onKeyDown={(e) => {
                  if (e.key == 'Enter') {
                    e.preventDefault()
                    handleSend()
                  }
                }}
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

function LiveMessages({
  sealedQuery,
  userId,
  conversationId,
}: {
  sealedQuery: SealedLiveQuery<MessagesRow>
  userId: string
  conversationId: string
}) {
  const { data: msgs } = useLiveQuery(sealedQuery, {
    async refreshQuery() {
      const res = await fetch('/api/messages/live-query', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      })

      if (!res.ok) {
        throw new Error(`Failed to refresh query (${res.status})`)
      }

      return res.json()
    },
  })
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex w-full max-w-sm flex-col gap-4 px-4 py-12">
        {msgs &&
          msgs.map((message) => (
            <Bubble
              key={message.id}
              variant={message.sender_id == userId ? 'default' : 'muted'}
              align={message.sender_id == userId ? 'end' : 'start'}
            >
              <BubbleContent>{message.message}</BubbleContent>
            </Bubble>
          ))}
      </div>
    </div>
  )
}
