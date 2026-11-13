import * as z from 'zod'

export const createProfileSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size < 5 * 1024 * 1024, 'Image size should be under 5MB'),
  bio: z.string(),
  city: z.string().min(1, 'City is required'),
  pincode: z.coerce.number().positive(),
})
