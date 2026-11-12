import { pgTable, unique } from 'drizzle-orm/pg-core'
import { items } from './items'
import { profiles } from './profiles'

export const conversations = pgTable(
  'conversations',
  (t) => ({
    id: t.uuid('id').defaultRandom().primaryKey(),
    itemId: t.uuid('item_id').references(() => items.id, { onDelete: 'cascade' }),
    ownerId: t.uuid('owner_id').references(() => profiles.id, { onDelete: 'cascade' }),
    borrowerId: t.uuid('borrower_id').references(() => profiles.id, { onDelete: 'cascade' }),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t
      .timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => [unique('unique_item_borrower').on(table.itemId, table.borrowerId)],
)

export type Conversation = typeof conversations.$inferSelect
export type NewConversation = typeof conversations.$inferInsert
