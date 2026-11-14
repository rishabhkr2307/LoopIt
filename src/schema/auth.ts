import * as z from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email().min(1, 'Email is required'),
  password: z.string().min(8, 'Minimum 8 characters are required'),
})

export const signInSchema = z.object({
  email: z.email().min(1, 'Email is required'),
  password: z.string().min(8, 'Minimum 8 characters are required'),
})
