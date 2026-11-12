'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import { cities } from '@/db/schema/cities'
import { profiles } from '@/db/schema/profiles'
import { auth } from '@/lib/auth/server'
import { createProfileSchema } from '@/schema/profile'
import { randomUUID } from 'crypto'
import { files } from '@/lib/storage/upload'

export async function createProfile(_prevState: { error: string } | null, formData: FormData) {
  const { success, data, error } = createProfileSchema.safeParse({
    bio: formData.get('bio'),
    avatar: formData.get('avatar'),
    city: formData.get('city'),
    pincode: formData.get('pincode'),
  })

  if (!success) {
    return { error: error.issues[0].message || 'Validation error' }
  }
  const { data: session } = await auth.getSession()
  if (!session?.user) {
    return { error: 'You should be logged in.' }
  }
  const profile = await db.query.profiles.findFirst({
    where: {
      userId: session.user.id,
    },
  })

  if (profile) {
    return { error: 'Profile already exists.' }
  }
  let city = await db.query.cities.findFirst({
    where: {
      pincode: data.pincode,
    },
  })
  if (!city) {
    const [created] = await db
      .insert(cities)
      .values({
        name: data.city,
        pincode: data.pincode,
      })
      .returning()
    city = created
  }
  const filename = `${randomUUID()}-${data.avatar.name}`

  await files.upload(`avatars/${filename}`, data.avatar, {
    contentType: data.avatar.type,
  })
  const avatarUrl = await files.url(`avatars/${filename}`)
  await db.insert(profiles).values({
    avatar: avatarUrl,
    bio: data.bio,
    cityId: city.id,
    userId: session.user.id,
  })
  redirect('/')
}
