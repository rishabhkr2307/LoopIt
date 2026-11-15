'use server'

import { db } from '@/db'
import { Request, requests } from '@/db/schema/requests'
import { auth } from '@/lib/auth/server'
import { eq } from 'drizzle-orm'

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
    if (item.ownerId == profile.id) {
      return { success: false, error: 'You are the owner' }
    }

    const request = await db.query.requests.findFirst({
      where: { itemId: item.id, borrowerId: profile.id },
    })
    if (request) {
      return { success: false, error: 'You already have a rental request on this item' }
    }
    await db.insert(requests).values({
      itemId: item.id,
      borrowerId: profile.id,
      ownerId: item.ownerId,
    })
    return { success: true }
  } catch (error) {
    console.error('Error at requestRental', error)
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
    const profile = await db.query.profiles.findFirst({
      where: { userId: session.user.id },
    })
    if (!profile) {
      return { success: false, error: 'Profile not found' }
    }
    const request = await db.query.requests.findFirst({ where: { id: requestId } })
    if (!request) {
      return { success: false, error: 'Request not found' }
    }
    if (request.ownerId != profile.id) {
      return { success: false, error: 'You are not the owner' }
    }
    await db.delete(requests).where(eq(requests.id, requestId))
    return { success: true }
  } catch (error) {
    console.error('Error at deleteRentalRequest', error)
    return { success: false }
  }
}

export async function getRentalRequestsByOwner(): Promise<{
  success: boolean
  error?: string
  data?: Request[]
}> {
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
    const requests = await db.query.requests.findMany({ where: { ownerId: profile.id } })

    return { success: true, data: requests }
  } catch (error) {
    console.error('Error at getRentalRequestsByOwner', error)
    return { success: false }
  }
}

export async function getRentalRequestsByBorrower(): Promise<{
  success: boolean
  error?: string
  data?: Request[]
}> {
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
    const requests = await db.query.requests.findMany({ where: { borrowerId: profile.id } })

    return { success: true, data: requests }
  } catch (error) {
    console.error('Error at getRentalRequestsByOwner', error)
    return { success: false }
  }
}
