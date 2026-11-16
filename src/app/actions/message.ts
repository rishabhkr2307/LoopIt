'use server'

import { db } from '@/db'
import { Message, messages } from '@/db/schema/messages'
import { auth } from '@/lib/auth/server'

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

    const [dbMessage] = await db
      .insert(messages)
      .values({
        message: message,
        conversationId: conversationId,
        senderId: session.user.id,
      })
      .returning()
    return { success: true, data: dbMessage }
  } catch (error) {
    console.error('Error at createMessage', error)
    return { success: false, error: 'Something went wrong' }
  }
}
