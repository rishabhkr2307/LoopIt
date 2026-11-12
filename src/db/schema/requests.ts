import { pgTable } from 'drizzle-orm/pg-core'
import { items } from './items'
import { profiles } from './profiles'
export const requests = pgTable('requests', (t) => ({
  id: t.uuid('id').defaultRandom().primaryKey(),
  itemId: t.uuid('item_id').references(() => items.id, { onDelete: 'cascade' }),
  borrowerId: t.uuid('borrower_id').references(() => profiles.id, { onDelete: 'cascade' }),
  duration: t.integer('duration').notNull(),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
  updatedAt: t
    .timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
}))

export type Request = typeof requests.$inferSelect
export type NewRequest = typeof requests.$inferInsert
