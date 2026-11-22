'use server'

import { db } from '@/db'
import { conversations } from '@/db/schema/conversations'
import { items } from '@/db/schema/items'
import { requests } from '@/db/schema/requests'
import { auth } from '@/lib/auth/server'
import { createRequestSchema } from '@/schema/request'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createRentalRequest(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const { success, data, error } = createRequestSchema.safeParse({
    itemId: formData.get('item_id'),
    requestDurationType: formData.get('duration_type'),
    duration: formData.get('duration'),
    message: formData.get('message'),
  })

  if (!success) {
    return { error: error.issues[0].message || 'Validation error' }
  }
  try {
    const { data: session } = await auth.getSession()
    if (!session || !session.user) {
      return { error: 'You should be logged in' }
    }
    const item = await db.query.items.findFirst({ where: { id: data.itemId } })
    if (!item || item.itemStatus != 'available') {
      return { error: 'Item not available' }
    }
    if (item.ownerId == session.user.id) {
      return { error: 'You are the owner' }
    }

    const request = await db.query.requests.findFirst({
      where: { itemId: item.id, borrowerId: session.user.id },
    })
    if (request) {
      return { error: 'You already have a rental request on this item' }
    }
    await db.insert(requests).values({
      itemId: item.id,
      borrowerId: session.user.id,
      ownerId: item.ownerId,
      durationType: data.requestDurationType,
      duration: data.duration,
      message: data.message,
    })
    return { success: true }
  } catch (error) {
    console.error('Error at createRentalRequest', error)
    return { error: 'Something went wrong' }
  }
}

export async function approveRentalRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session || !session.user) {
      return { success: false, error: 'You should be logged in' }
    }
    const request = await db.query.requests.findFirst({
      where: { id: requestId, ownerId: session.user.id },
    })

    if (!request) {
      return { success: false, error: 'Request not found or you are not owner' }
    }
    if (request.status != 'pending') {
      return { success: false, error: 'You can only approve pending requests' }
    }
    await db.update(requests).set({ status: 'approved' }).where(eq(requests.id, requestId))
    await db.update(items).set({ itemStatus: 'rented' }).where(eq(items.id, request.itemId))
    await db.insert(conversations).values({
      ownerId: session.user.id,
      itemId: request.itemId,
      borrowerId: request.borrowerId,
    })
    revalidatePath('/owner/requests')
    return { success: true }
  } catch (error) {
    console.error('Error at approveRentalRequest', error)
    return { success: false }
  }
}

export async function rejectRentalRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session || !session.user) {
      return { success: false, error: 'You should be logged in' }
    }
    const request = await db.query.requests.findFirst({
      where: { id: requestId, ownerId: session.user.id },
    })

    if (!request) {
      return { success: false, error: 'Request not found or you are not owner' }
    }
    if (request.status != 'pending') {
      return { success: false, error: 'You can only reject pending requests' }
    }
    await db.update(requests).set({ status: 'rejected' }).where(eq(requests.id, requestId))
    revalidatePath('/owner/requests')
    return { success: true }
  } catch (error) {
    console.error('Error at rejectRentalRequest', error)
    return { success: false }
  }
}

export async function deleteRentalRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session || !session.user) {
      return { success: false, error: 'You should be logged in' }
    }

    const request = await db.query.requests.findFirst({
      where: { id: requestId, borrowerId: session.user.id },
    })
    if (!request) {
      return { success: false, error: 'Request not found or You are not the borrower' }
    }
    if (request.status != 'pending') {
      return { success: false, error: 'You can only delete pending requests' }
    }
    await db.delete(requests).where(eq(requests.id, requestId))
    revalidatePath('/requests')
    return { success: true }
  } catch (error) {
    console.error('Error at deleteRentalRequest', error)
    return { success: false }
  }
}

export async function completeRentalRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session || !session.user) {
      return { success: false, error: 'You should be logged in' }
    }

    const request = await db.query.requests.findFirst({
      where: { id: requestId, ownerId: session.user.id },
    })
    if (!request) {
      return { success: false, error: 'Request not found or You are not the owner' }
    }
    if (request.status != 'approved') {
      return { success: false, error: 'You can not complete a request before approval' }
    }
    await db.update(requests).set({ status: 'completed' }).where(eq(requests.id, requestId))
    await db.update(items).set({ itemStatus: 'available' }).where(eq(items.id, request.itemId))
    revalidatePath('/owner/requests')
    return { success: true }
  } catch (error) {
    console.error('Error at completeRentalRequest', error)
    return { success: false }
  }
}
