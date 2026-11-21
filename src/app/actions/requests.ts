'use server'

import { db } from '@/db'
import { conversations } from '@/db/schema/conversations'
import { items } from '@/db/schema/items'
import { requests } from '@/db/schema/requests'
import { auth } from '@/lib/auth/server'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createRentalRequest(
  itemId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session || !session.user) {
      return { success: false, error: 'You should be logged in' }
    }
    const profile = await db.query.profiles.findFirst({
      where: { userId: session.user.id },
    })
    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }
    const item = await db.query.items.findFirst({ where: { id: itemId } })
    if (!item || item.itemStatus != 'available') {
      return { success: false, error: 'Item not available' }
    }
    if (item.ownerId == profile.userId) {
      return { success: false, error: 'You are the owner' }
    }

    const request = await db.query.requests.findFirst({
      where: { itemId: item.id, borrowerId: profile.userId },
    })
    if (request) {
      return { success: false, error: 'You already have a rental request on this item' }
    }
    await db.insert(requests).values({
      itemId: item.id,
      borrowerId: profile.userId,
      ownerId: item.ownerId,
    })
    return { success: true }
  } catch (error) {
    console.error('Error at createRentalRequest', error)
    return { success: false }
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
