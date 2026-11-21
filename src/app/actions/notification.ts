'use server'

import { db } from '@/db'
import { notifications } from '@/db/schema/notifications'
import { auth } from '@/lib/auth/server'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function sendNotification(
  userId: string,
  title: string,
  description?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.insert(notifications).values({
      title,
      description,
      userId,
    })
    return { success: true }
  } catch (error) {
    console.error('Error at sendNotification', error)
    return { success: false }
  }
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session || !session.user) {
      return { success: false, error: 'You should be logged in' }
    }
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, session.user.id)))
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error at markNotificationAsRead', error)
    return { success: false }
  }
}
