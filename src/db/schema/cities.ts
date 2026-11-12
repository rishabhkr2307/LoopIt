import { pgTable, index } from 'drizzle-orm/pg-core'

export const cities = pgTable(
  'cities',
  (t) => ({
    id: t.uuid('id').defaultRandom().primaryKey(),
    name: t.text('name').notNull(),
    pincode: t.integer('pincode').notNull(),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t
      .timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => [index('pincode_idx').on(table.pincode)],
)
