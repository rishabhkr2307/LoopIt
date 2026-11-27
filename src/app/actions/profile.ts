'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import { cities } from '@/db/schema/cities'
import { profiles } from '@/db/schema/profiles'
import { auth } from '@/lib/auth/server'
import { createProfileSchema, editProfileSchema } from '@/schema/profile'
import { randomUUID } from 'crypto'
import { files } from '@/lib/storage/upload'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

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
  try {
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
    let avatarUrl = null
    if (data.avatar) {
      const filename = `${randomUUID()}-${data.avatar.name}`

      await files.upload(`avatars/${filename}`, data.avatar, {
        contentType: data.avatar.type,
      })
      avatarUrl = await files.url(`avatars/${filename}`)
    }
    await db.insert(profiles).values({
      avatar: avatarUrl,
      fullName: session.user.name,
      bio: data.bio,
      cityId: city.id,
      userId: session.user.id,
    })
  } catch (error) {
    console.error('Error at createProfile', error)
    return { error: 'Something went wrong' }
  }
  redirect('/')
}

export async function editProfile(_prevState: { error: string } | null, formData: FormData) {
  const { success, data, error } = editProfileSchema.safeParse({
    bio: formData.get('bio'),
    avatar: formData.get('avatar'),
    city: formData.get('city'),
    pincode: formData.get('pincode'),
    profileId: formData.get('profile_id'),
  })

  if (!success) {
    return { error: error.issues[0].message || 'Validation error' }
  }
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user) {
      return { error: 'You should be logged in.' }
    }
    const profile = await db.query.profiles.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (!profile) {
      return { error: 'Please create a profile first' }
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
    let avatarUrl = profile.avatar
    if (data.avatar) {
      const filename = `${randomUUID()}-${data.avatar.name}`

      await files.upload(`avatars/${filename}`, data.avatar, {
        contentType: data.avatar.type,
      })
      avatarUrl = await files.url(`avatars/${filename}`)
    }
    await db
      .update(profiles)
      .set({
        avatar: avatarUrl,
        bio: data.bio,
        cityId: city.id,
      })
      .where(eq(profiles.id, data.profileId))
    revalidatePath('/owner/profile')
  } catch (error) {
    console.error('Error at editProfile', error)
    return { error: 'Something went wrong' }
  }
  redirect('/owner/profile')
}
