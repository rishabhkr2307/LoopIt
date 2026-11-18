import { pgTable } from 'drizzle-orm/pg-core'
import { items } from './items'

export const reviews = pgTable('reviews', (t) => ({
  id: t.uuid('id').defaultRandom().primaryKey(),
  itemId: t
    .uuid('item_id')
    .references(() => items.id, { onDelete: 'cascade' })
    .notNull(),
  rating: t.integer('rating').notNull(),
  description: t.text('description').notNull(),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
  updatedAt: t
    .timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
}))

export type Request = typeof reviews.$inferSelect
export type NewRequest = typeof reviews.$inferInsert
