import { index, pgTable } from 'drizzle-orm/pg-core'
import { profiles } from './profiles'
import { conversations } from './conversations'

export const messages = pgTable(
  'messages',
  (t) => ({
    id: t.uuid('id').defaultRandom().primaryKey(),
    conversationId: t
      .uuid('conversation_id')
      .references(() => conversations.id, { onDelete: 'cascade' }),
    senderId: t.uuid('sender_id').references(() => profiles.id, { onDelete: 'cascade' }),
    message: t.text('message').notNull(),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t
      .timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => [index('conversation_id_idx').on(table.conversationId)],
)
