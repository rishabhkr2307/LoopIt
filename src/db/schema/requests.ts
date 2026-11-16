import { pgTable } from 'drizzle-orm/pg-core'
import { items } from './items'
import { profiles } from './profiles'
import { requestStatus } from './enums'
export const requests = pgTable('requests', (t) => ({
  id: t.uuid('id').defaultRandom().primaryKey(),
  itemId: t
    .uuid('item_id')
    .references(() => items.id, { onDelete: 'cascade' })
    .notNull(),
  ownerId: t
    .uuid('owner_id')
    .references(() => profiles.userId, { onDelete: 'cascade' })
    .notNull(),
  borrowerId: t
    .uuid('borrower_id')
    .references(() => profiles.userId, { onDelete: 'cascade' })
    .notNull(),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
  updatedAt: t
    .timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
  status: requestStatus('request_status').default('pending'),
}))

export type Request = typeof requests.$inferSelect
export type NewRequest = typeof requests.$inferInsert
