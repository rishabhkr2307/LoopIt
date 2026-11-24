import 'server-only'

import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { messages } from '@/db/schema/messages'
import { getRealtime } from '@/lib/realtime'

export function messagesQuery(conversationId: string) {
  return db
    .select({
      id: messages.id,
      conversation_id: messages.conversationId,
      sender_id: messages.senderId,
      message: messages.message,
      created_at: messages.createdAt,
    })
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt))
}

export type MessagesRow = Awaited<ReturnType<typeof messagesQuery>>[number]
export const sealMessages = (conversationId: string) =>
  getRealtime().seal({ query: messagesQuery(conversationId) })
