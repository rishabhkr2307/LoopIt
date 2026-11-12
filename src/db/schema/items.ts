import { index, pgTable } from 'drizzle-orm/pg-core'
import { profiles } from './profiles'
import { itemCategory, itemStatus } from './enums'
import { cities } from './cities'

export const items = pgTable(
  'items',
  (t) => ({
    id: t.uuid('id').defaultRandom().primaryKey(),
    ownerId: t.uuid('owner_id').references(() => profiles.id, { onDelete: 'cascade' }),
    name: t.text('name').notNull(),
    description: t.text('description').notNull(),
    imageUrl: t.text('image_url'),
    itemCategory: itemCategory('item_category').notNull(),
    itemStatus: itemStatus('item_status').default('available'),
    cityId: t.uuid('city_id').references(() => cities.id),
    price: t.integer().default(0),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t
      .timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => [index('owner_id_idx').on(table.ownerId), index('city_id_idx').on(table.cityId)],
)

export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
