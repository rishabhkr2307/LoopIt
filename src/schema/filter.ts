import * as z from 'zod'
import {
  aboveRatingEnum,
  categoryEnum,
  orderByPriceEnum,
  orderByTimeEnum,
  requestStatusEnum,
  statusEnum,
} from './enums'

export const filterSchema = z.object({
  category: categoryEnum.optional().catch(undefined),
  cityName: z.string().optional().catch(undefined),
  orderByPrice: orderByPriceEnum.optional().catch(undefined),
  orderByTime: orderByTimeEnum.optional().catch(undefined),
  searchQ: z.string().optional().catch(undefined),
  aboveRating: aboveRatingEnum.optional().catch(undefined),
  page: z.coerce.number().positive().optional().catch(undefined),
})

export const profileFilterSchema = z.object({
  itemStatus: statusEnum.optional().catch(undefined),
  page: z.coerce.number().positive().optional().catch(undefined),
})

export const requestsFilterSchema = z.object({
  requestStatus: requestStatusEnum.optional().catch(undefined),
  page: z.coerce.number().positive().optional().catch(undefined),
})
