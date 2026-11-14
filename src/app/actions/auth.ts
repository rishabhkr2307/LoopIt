'use server'

import { auth } from '@/lib/auth/server'
import { signInSchema, signUpSchema } from '@/schema/auth'
import { redirect } from 'next/navigation'

export async function signUpWithEmail(_prevState: { error: string } | null, formData: FormData) {
  const { success, data, error } = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!success) {
    return { error: error.issues[0].message || 'Validation error' }
  }
  try {
    const { error } = await auth.signUp.email({
      email: data.email,
      name: data.name,
      password: data.password,
    })

    if (error) {
      return { error: error.message || 'Failed to create account' }
    }
  } catch (error) {
    console.error('Error at signUpWithEmail', error)
    return { error: 'Something went wrong' }
  }

  redirect(`/verify-email?email=${data.email}`)
}

export async function signInWithEmail(_prevState: { error: string } | null, formData: FormData) {
  const { success, data, error } = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!success) {
    return { error: error.issues[0].message || 'Validation error' }
  }
  try {
    const { error } = await auth.signIn.email({
      email: data.email,
      password: data.password,
    })
    if (error) {
      return { error: error.message || 'Failed to sign in. Try again' }
    }
  } catch (error) {
    console.error('Error at signInWithEmail', error)
    return { error: 'Something went wrong' }
  }
  redirect('/')
}
