'use server'
import { db } from '@/db'
import { itemCategory } from '@/db/schema/enums'
import { Item, items } from '@/db/schema/items'
import { auth } from '@/lib/auth/server'
import { files } from '@/lib/storage/upload'
import { createItemSchema, editItemSchema } from '@/schema/items'
import { randomUUID } from 'crypto'
import { and, asc, desc, eq, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function createItem(_prevState: { error: string } | null, formData: FormData) {
  const { success, data, error } = createItemSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    image: formData.get('image'),
    price: formData.get('price'),
    category: formData.get('category'),
    status: formData.get('status'),
    pricePerDay: formData.get('price_per_day'),
    pricePerWeek: formData.get('price_per_week'),
    pricePerMonth: formData.get('price_per_month'),
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
      pricePerDay: data.pricePerDay,
      pricePerWeek: data.pricePerWeek,
      pricePerMonth: data.pricePerMonth,
      cityId: profile.cityId,
      ownerId: profile.userId,
      imageUrl,
    })
  } catch (error) {
    console.error('Error at createItem', error)
    return { error: 'Something went wrong' }
  }

  redirect('/owner/profile')
}

export async function editItem(_prevState: { error: string } | null, formData: FormData) {
  console.log(formData)
  const { success, data, error } = editItemSchema.safeParse({
    item_id: formData.get('item_id'),
    name: formData.get('name'),
    description: formData.get('description'),
    image: formData.get('image'),
    price: formData.get('price'),
    category: formData.get('category'),
    status: formData.get('status'),
    pricePerDay: formData.get('price_per_day'),
    pricePerWeek: formData.get('price_per_week'),
    pricePerMonth: formData.get('price_per_month'),
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
      return { error: 'You should have a profile first.' }
    }
    const item = await db.query.items.findFirst({ where: { id: data.item_id } })
    if (!item) {
      return { error: 'Item not found' }
    }
    let imageUrl = item.imageUrl
    if (data.image) {
      const filename = `${randomUUID()}-${data.image.name}`

      await files.upload(`items/${filename}`, data.image, {
        contentType: data.image.type,
      })
      imageUrl = await files.url(`items/${filename}`)
    }

    await db
      .update(items)
      .set({
        name: data.name,
        description: data.description,
        itemCategory: data.category,
        pricePerDay: data.pricePerDay,
        pricePerWeek: data.pricePerWeek,
        pricePerMonth: data.pricePerMonth,
        cityId: profile.cityId,
        ownerId: profile.userId,
        imageUrl,
      })
      .where(eq(items.id, data.item_id))
  } catch (error) {
    console.error('Error at editItem', error)
    return { error: 'Something went wrong' }
  }

  redirect('/owner/profile')
}
export async function deleteItemById(
  itemId: string,
): Promise<{ success: boolean; error?: string }> {
  const { data } = await auth.getSession()
  if (!data || !data.user) {
    return { success: false, error: 'You should be logged in.' }
  }
  try {
    await db.delete(items).where(and(eq(items.id, itemId), eq(items.ownerId, data.user.id)))
    return { success: true }
  } catch (error) {
    console.error('Error at deleteItemById', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function getItemsWithFilters(filters: {
  category?: string
  cityId?: string
  orderByTime?: 'asc' | 'desc'
  orderByPrice?: 'asc' | 'desc'
  searchQ?: string
}): Promise<{
  success: boolean
  error?: string
  data?: Item[]
}> {
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user) {
      return { success: false, error: 'You should be logged in.' }
    }
    const profile = await db.query.profiles.findFirst({
      where: {
        userId: session.user.id,
      },
    })

    if (!profile) {
      return { success: false, error: 'You should have a profile first.' }
    }
    const searchVector = sql`
      (
        setweight(
          to_tsvector('english', ${items.name}),
          'A'
        )
        ||
        setweight(
          to_tsvector(
            'english',
            coalesce(${items.description}, '')
          ),
          'B'
        )
      )
    `

    const conditions = [
      filters.cityId ? eq(items.cityId, filters.cityId) : undefined,

      filters.category
        ? eq(items.itemCategory, filters.category as (typeof itemCategory.enumValues)[number])
        : undefined,

      filters.searchQ?.trim()
        ? sql`${searchVector} @@ websearch_to_tsquery('english', ${filters.searchQ.trim()})`
        : undefined,
    ].filter(Boolean)

    const orderBy = []

    if (filters.searchQ?.trim()) {
      const searchQuery = sql`
        websearch_to_tsquery('english', ${filters.searchQ.trim()})
      `

      orderBy.push(desc(sql`ts_rank(${searchVector}, ${searchQuery})`))
    }

    if (filters.orderByTime) {
      orderBy.push(filters.orderByTime === 'asc' ? asc(items.createdAt) : desc(items.createdAt))
    }

    if (filters.orderByPrice) {
      orderBy.push(
        filters.orderByPrice === 'asc' ? asc(items.pricePerDay) : desc(items.pricePerDay),
      )
    }
    const dbItems = await db
      .select()
      .from(items)
      .where(and(...conditions))
      .orderBy(...orderBy)

    return { success: true, data: dbItems }
  } catch (error) {
    console.error('Error at getItemsWithFilters', error)
    return { success: false, error: 'Something went wrong' }
  }
}
