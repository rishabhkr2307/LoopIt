'use client'
import { markNotificationAsRead } from '@/app/actions/notification'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Notification } from '@/db/schema/notifications'
import { BellIcon, BellRingingIcon, CheckIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function NotificationPopover({ notifications }: { notifications: Notification[] }) {
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
            {notifications.length == 0 ? <BellIcon /> : <BellRingingIcon />}
          </Button>
        }
      />
      <PopoverContent className="w-80 md:mr-56">
        {notifications.length == 0 ? (
          <div>No Notifications</div>
        ) : (
          notifications.map((notification) => (
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
      </PopoverContent>
    </Popover>
  )
}
