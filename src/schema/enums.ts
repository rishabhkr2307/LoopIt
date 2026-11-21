import * as z from 'zod'

export const categoryEnum = z.enum([
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

export const statusEnum = z.enum(['available', 'rented', 'archived'])
export const requestStatusEnum = z.enum(['pending', 'approved', 'rejected', 'completed'])
export const reviewTypeEnum = z.enum(['item', 'owner', 'borrower'])
export const requestDurationTypeEnum = z.enum(['days', 'weeks', 'months'])

export const orderByPriceEnum = z.enum(['asc', 'desc'])
export const orderByTimeEnum = z.enum(['asc', 'desc'])
export const aboveRatingEnum = z.enum(['1', '2', '3', '4'])
