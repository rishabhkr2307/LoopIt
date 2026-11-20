import { pgTable } from 'drizzle-orm/pg-core'
import { items } from './items'
import { profiles } from './profiles'

export const reviews = pgTable('reviews', (t) => ({
  id: t.uuid('id').defaultRandom().primaryKey(),
  reviewerId: t
    .uuid('reviewer_id')
    .references(() => profiles.userId, { onDelete: 'cascade' })
    .notNull(),
  revieweeId: t.uuid('reviewee_id').references(() => profiles.userId, { onDelete: 'cascade' }),
  itemId: t.uuid('item_id').references(() => items.id, { onDelete: 'cascade' }),
  rating: t.integer('rating').notNull(),
  description: t.text('description').notNull(),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
  updatedAt: t
    .timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
}))

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
