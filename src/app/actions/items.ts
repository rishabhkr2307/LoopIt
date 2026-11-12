'use server'
import { db } from '@/db'
import { items } from '@/db/schema/items'
import { auth } from '@/lib/auth/server'
import { files } from '@/lib/storage/upload'
import { createItemSchema } from '@/schema/items'
import { randomUUID } from 'crypto'
import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function createItem(_prevState: { error: string } | null, formData: FormData) {
  const { success, data, error } = createItemSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    image: formData.get('image'),
    price: formData.get('price'),
    category: formData.get('category'),
    status: formData.get('status'),
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

  if (!profile) {
    return { error: 'You should have a profile first.' }
  }
  const filename = `${randomUUID()}-${data.image.name}`

  await files.upload(`items/${filename}`, data.image, {
    contentType: data.image.type,
  })
  const imageUrl = await files.url(`items/${filename}`)

  await db.insert(items).values({
    name: data.name,
    description: data.description,
    itemCategory: data.category,
    price: data.price,
    cityId: profile.cityId,
    ownerId: profile.id,
    imageUrl,
  })

  redirect('/')
}

export async function deleteItemById(itemId: string) {
  const { data } = await auth.getSession()
  if (!data?.user) {
    return { error: 'You should be logged in.' }
  }

  await db.delete(items).where(and(eq(items.id, itemId), eq(items.ownerId, data.user.id)))
}
