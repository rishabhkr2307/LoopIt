'use client'
import { markNotificationAsRead } from '@/app/actions/notification'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { NotificationsRow } from '@/lib/realtime/notifications'
import { RealtimeProvider, useLiveQuery } from '@neon/realtime-react'
import { createRealtimeClient, SealedLiveQuery } from '@neon/realtime/client'
import { BellIcon, BellRingingIcon, CheckIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'

export function NotificationPopover({
  sealedQuery,
  userId,
}: {
  sealedQuery: SealedLiveQuery<NotificationsRow> | null
  userId: string
}) {
  const [client] = useState(() =>
    createRealtimeClient({
      url: process.env.NEXT_PUBLIC_NEON_REALTIME_WSS_URL!,
    }),
  )
  return (
    <RealtimeProvider client={client}>
      {sealedQuery && <LiveNotifications sealedQuery={sealedQuery!} userId={userId} />}
    </RealtimeProvider>
  )
}

function LiveNotifications({
  sealedQuery,
  userId,
}: {
  sealedQuery: SealedLiveQuery<NotificationsRow>
  userId: string
}) {
  const { data: notifications } = useLiveQuery(sealedQuery, {
    async refreshQuery() {
      const res = await fetch('/api/notifications/live-query', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!res.ok) {
        throw new Error(`Failed to refresh query (${res.status})`)
      }

      return res.json()
    },
  })
  const handlerMarkAsRead = async (notificationId: string) => {
    if (!notificationId) return
    try {
      const { success, error } = await markNotificationAsRead(notificationId)
      if (!success) {
        toast.error(error)
        return
      }
      toast.success('Notification marked as read')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    }
  }
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="icon">
            {notifications && notifications.length > 0 ? (
              <BellRingingIcon fill="#FF2C2C" />
            ) : (
              <BellIcon />
            )}
          </Button>
        }
      />
      <PopoverContent className="w-80 md:mr-56">
        {notifications && notifications.length == 0 ? (
          <div>No Notifications</div>
        ) : (
          notifications?.map((notification) => (
            <Item variant="outline" key={notification.id}>
              <ItemContent>
                <ItemTitle>{notification.title}</ItemTitle>
                <ItemDescription>{notification.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={async () => await handlerMarkAsRead(notification.id)}
                >
                  <CheckIcon />
                </Button>
              </ItemActions>
            </Item>
          ))
        )}
        <div className="text-xs text-muted-foreground">
          To view messages, go to the Requests page, open the dropdown menu for the relevant
          request, and click Messages.
        </div>
      </PopoverContent>
    </Popover>
  )
}
