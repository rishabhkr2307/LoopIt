import * as z from 'zod'
import { aboveRatingEnum, categoryEnum, orderByPriceEnum, orderByTimeEnum } from './enums'

export const filterSchema = z.object({
  category: categoryEnum.optional().catch(undefined),
  cityId: z.uuid().optional().catch(undefined),
  orderByPrice: orderByPriceEnum.optional().catch(undefined),
  orderByTime: orderByTimeEnum.optional().catch(undefined),
  searchQ: z.string().optional().catch(undefined),
  aboveRating: aboveRatingEnum.optional().catch(undefined),
})
