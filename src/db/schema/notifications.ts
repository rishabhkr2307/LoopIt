import { pgTable, index } from 'drizzle-orm/pg-core'
import { profiles } from './profiles'

export const notifications = pgTable(
  'notifications',
  (t) => ({
    id: t.uuid('id').defaultRandom().primaryKey(),
    title: t.text('title').notNull(),
    description: t.text('description'),
    userId: t
      .uuid('user_id')
      .references(() => profiles.userId, { onDelete: 'cascade' })
      .notNull(),
    isRead: t.boolean('is_read').default(false),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t
      .timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => [index('user_notification_idx').on(table.userId)],
)

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
