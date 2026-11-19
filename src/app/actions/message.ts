'use server'

import { db } from '@/db'
import { Message, messages } from '@/db/schema/messages'
import { auth } from '@/lib/auth/server'
import { sendNotification } from './notification'

export async function createMessage(
  conversationId: string,
  message: string,
): Promise<{
  success: boolean
  error?: string
  data?: Message
}> {
  try {
    const { data: session } = await auth.getSession()
    if (!session || !session.user) {
      return { success: false, error: 'You should be logged in' }
    }

    const conversation = await db.query.conversations.findFirst({ where: { id: conversationId } })
    if (!conversation) {
      return { success: false, error: 'Conversation not found' }
    }

    const [dbMessage] = await db
      .insert(messages)
      .values({
        message: message,
        conversationId: conversationId,
        senderId: session.user.id,
      })
      .returning()
    await sendNotification(
      conversation.borrowerId == session.user.id ? conversation.ownerId : conversation.borrowerId,
      'New Message',
      `${session.user.name} sent you a message`,
    )
    return { success: true, data: dbMessage }
  } catch (error) {
    console.error('Error at createMessage', error)
    return { success: false, error: 'Something went wrong' }
  }
}
