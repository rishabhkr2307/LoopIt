import { index, pgTable } from 'drizzle-orm/pg-core'
import { priceType } from './enums'
import { items } from './items'

export const prices = pgTable(
  'prices',
  (t) => ({
    id: t.uuid('id').defaultRandom().primaryKey(),
    itemId: t
      .uuid()
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    priceType: priceType('price_type').notNull(),
    price: t.integer('price').default(0),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t
      .timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => [index('item_id_idx').on(table.itemId)],
)
