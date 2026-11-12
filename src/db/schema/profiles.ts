import { index, pgTable } from 'drizzle-orm/pg-core'
import { cities } from './cities'

export const profiles = pgTable(
  'profiles',
  (t) => ({
    id: t.uuid('id').defaultRandom().primaryKey(),
    userId: t.text('user_id').notNull(),
    bio: t.text('bio'),
    avatar: t.text('avatar'),
    cityId: t
      .uuid('city_id')
      .references(() => cities.id)
      .notNull(),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t
      .timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => [index('user_id_idx').on(table.userId)],
)

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
