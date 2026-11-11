'use server'

import { redirect } from 'next/navigation'
import { db } from '@/db'
import { cities } from '@/db/schema/cities'
import { profiles } from '@/db/schema/profiles'
import { auth } from '@/lib/auth/server'

export async function createProfile(_prevState: { error: string } | null, formData: FormData) {
  const { data } = await auth.getSession()
  if (!data?.user) {
    return { error: 'You should be logged in.' }
  }

  const pincode = formData.get('pincode') as string
  let city = await db.query.cities.findFirst({
    where: {
      pincode: pincode,
    },
  })
  if (!city) {
    const [created] = await db
      .insert(cities)
      .values({
        name: formData.get('city') as string,
        pincode,
      })
      .returning()
    city = created
  }
  await db.insert(profiles).values({
    bio: formData.get('bio') as string,
    cityId: city.id,
    userId: data.user.id,
  })
  redirect('/')
}
