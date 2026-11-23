'use server'
import { db } from '@/db'
import { reviews } from '@/db/schema/reviews'
import { auth } from '@/lib/auth/server'
import { createReviewSchema } from '@/schema/review'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

export async function createReview(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  const { success, data, error } = createReviewSchema.safeParse({
    reviewType: formData.get('review_type'),
    itemId: formData.get('item_id'),
    ownerId: formData.get('owner_id'),
    borrowerId: formData.get('borrower_id'),
    rating: formData.get('rating'),
    description: formData.get('description'),
  })

  if (!success) {
    return { error: error.issues[0].message || 'Validation error' }
  }
  try {
    switch (data.reviewType) {
      case 'item':
        return await createItemReview(data)
      case 'borrower':
        return await createBorrowerReview(data)
      case 'owner':
        return await createOwnerReview(data)

      default:
        return { error: 'Something went wrong' }
    }
  } catch (error) {
    console.error('Error at createReview', error)
    return { error: 'Something went wrong' }
  }
}

async function createItemReview(
  review: z.infer<typeof createReviewSchema>,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user) {
      return { error: 'You should be logged in.' }
    }
    const itemReview = await db.query.reviews.findFirst({
      where: {
        itemId: review.itemId,
        reviewerId: session.user.id,
      },
    })

    if (itemReview) {
      return { error: 'Review already exists.' }
    }

    const owner = await db.query.items.findFirst({
      where: {
        id: review.itemId,
        ownerId: session.user.id,
      },
    })

    if (owner) {
      return { error: 'Owner can not review the item' }
    }

    await db.insert(reviews).values({
      itemId: review.itemId,
      reviewerId: session.user.id,
      rating: review.rating,
      description: review.description,
    })
    revalidatePath('/requests')
    return { success: true }
  } catch (error) {
    console.error('Error at createItemReview', error)
    return { error: 'Something went wrong' }
  }
}

async function createBorrowerReview(
  review: z.infer<typeof createReviewSchema>,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user) {
      return { error: 'You should be logged in.' }
    }

    if (session.user.id === review.borrowerId) {
      return { error: 'You are the borrower. Owners can create borrower review' }
    }

    const borrowerReview = await db.query.reviews.findFirst({
      where: {
        revieweeId: review.borrowerId,
        reviewerId: session.user.id,
      },
    })

    if (borrowerReview) {
      return { error: 'Borrower Review already exists.' }
    }

    await db.insert(reviews).values({
      revieweeId: review.borrowerId,
      reviewerId: session.user.id,
      rating: review.rating,
      description: review.description,
    })
    return { success: true }
  } catch (error) {
    console.error('Error at createBorrowerReview', error)
    return { error: 'Something went wrong' }
  }
}

async function createOwnerReview(
  review: z.infer<typeof createReviewSchema>,
): Promise<{ error?: string; success?: boolean }> {
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user) {
      return { error: 'You should be logged in.' }
    }

    if (session.user.id === review.ownerId) {
      return { error: 'You are the owner. Borrowers can create owner review' }
    }

    const ownerReview = await db.query.reviews.findFirst({
      where: {
        revieweeId: review.ownerId,
        reviewerId: session.user.id,
      },
    })

    if (ownerReview) {
      return { error: 'Owner Review already exists.' }
    }

    await db.insert(reviews).values({
      revieweeId: review.ownerId,
      reviewerId: session.user.id,
      rating: review.rating,
      description: review.description,
    })

    return { success: true }
  } catch (error) {
    console.error('Error at createOwnerReview', error)
    return { error: 'Something went wrong' }
  }
}
