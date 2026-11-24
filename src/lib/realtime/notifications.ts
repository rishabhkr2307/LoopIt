import 'server-only'

import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { getRealtime } from '@/lib/realtime'
import { notifications } from '@/db/schema/notifications'

export function notificationsQuery(userId: string) {
  return db
    .select({
      id: notifications.id,
      title: notifications.title,
      description: notifications.description,
    })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
    .orderBy(desc(notifications.createdAt))
}

export type NotificationsRow = Awaited<ReturnType<typeof notificationsQuery>>[number]
export const sealNotifications = (userId: string) =>
  getRealtime().seal({ query: notificationsQuery(userId) })
