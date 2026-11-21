import { index, pgTable } from 'drizzle-orm/pg-core'
import { profiles } from './profiles'
import { itemCategory, itemStatus } from './enums'
import { sql } from 'drizzle-orm'

export const items = pgTable(
  'items',
  (t) => ({
    id: t.uuid('id').defaultRandom().primaryKey(),
    ownerId: t
      .uuid('owner_id')
      .references(() => profiles.userId, { onDelete: 'cascade' })
      .notNull(),
    name: t.text('name').notNull(),
    description: t.text('description').notNull(),
    imageUrl: t.text('image_url').notNull(),
    itemCategory: itemCategory('item_category').notNull(),
    itemStatus: itemStatus('item_status').default('available'),
    cityName: t.text('city_name').notNull(),
    pincode: t.text('pincode').notNull(),
    pricePerDay: t.integer('price_per_day').default(0).notNull(),
    pricePerWeek: t.integer('price_per_week').default(0).notNull(),
    pricePerMonth: t.integer('price_per_month').default(0).notNull(),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
    updatedAt: t
      .timestamp('updated_at')
      .notNull()
      .$onUpdate(() => new Date()),
  }),
  (table) => [
    index('owner_id_idx').on(table.ownerId),
    index('items_city_name_idx').on(table.cityName),
    index('items_pincode_idx').on(table.pincode),
    index('items_search_idx').using(
      'gin',
      sql`(
        setweight(
          to_tsvector('english', ${table.name}),
          'A'
        )
        ||
        setweight(
          to_tsvector('english', coalesce(${table.description}, '')),
          'B'
        )
      )`,
    ),
  ],
)

export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
