import * as z from 'zod'
import { reviewTypeEnum } from './enums'

export const createReviewSchema = z.object({
  reviewType: reviewTypeEnum,
  itemId: z.uuid(),
  ownerId: z.uuid(),
  borrowerId: z.uuid(),
  rating: z.coerce.number().min(0).max(5),
  description: z.string(),
})
