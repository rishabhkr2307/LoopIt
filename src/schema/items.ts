import * as z from 'zod'

const category = z.enum([
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
const status = z.enum(['available', 'unavailable', 'archived'])
export const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size > 0, 'Image is required')
    .refine((file) => file.size <= 1024 * 1024, 'Image size should be under 1MB'),
  category: category,
  status: status,
  pricePerDay: z.coerce.number().min(0, 'Must be a positive number or zero'),
  pricePerWeek: z.coerce.number().min(0, 'Must be a positive number or zero'),
  pricePerMonth: z.coerce.number().min(0, 'Must be a positive number or zero'),
})
