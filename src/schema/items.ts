import * as z from 'zod'
import { categoryEnum } from './enums'

export const createItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z
    .instanceof(File, { message: 'Image is required' })
    .refine((file) => file.size > 0, 'Image is required')
    .refine((file) => file.size < 5 * 1024 * 1024, 'Image size should be under 5MB'),
  category: categoryEnum,
  pricePerDay: z.coerce.number().min(0, 'Must be a positive number or zero'),
  pricePerWeek: z.coerce.number().min(0, 'Must be a positive number or zero'),
  pricePerMonth: z.coerce.number().min(0, 'Must be a positive number or zero'),
})

export const editItemSchema = z.object({
  item_id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z
    .instanceof(File)
    .refine((file) => file.size < 5 * 1024 * 1024, 'Image size should be under 5MB')
    .transform((file) => (file.size == 0 ? undefined : file))
    .optional(),
  category: categoryEnum,
  pricePerDay: z.coerce.number().min(0, 'Must be a positive number or zero'),
  pricePerWeek: z.coerce.number().min(0, 'Must be a positive number or zero'),
  pricePerMonth: z.coerce.number().min(0, 'Must be a positive number or zero'),
})
