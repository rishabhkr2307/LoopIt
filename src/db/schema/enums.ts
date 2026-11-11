import { pgEnum } from 'drizzle-orm/pg-core'

export const priceType = pgEnum('price_type', ['hourly', 'daily', 'weekly', 'monthly'])

export const itemStatus = pgEnum('item_status', ['available', 'unavailable', 'archived'])

export const itemCategory = pgEnum('item_category', [
  'electronics_gadgets',
  'tools_equipment',
  'fashion_accessories',
  'furniture_home',
  'sports_outdoors',
  'vehicles_mobility',
  'events_party_supplies',
  'baby_kids',
  'appliances',
  'travel_luggage',
  'construction_industrial',
  'music_instruments',
  'office_business',
  'home_decor_lifestyle',
  'photography_production',
  'entertainment_recreation',
])
