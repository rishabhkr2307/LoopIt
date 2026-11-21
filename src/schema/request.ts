import * as z from 'zod'
import { requestDurationTypeEnum } from './enums'

export const createRequestSchema = z.object({
  itemId: z.uuid(),
  requestDurationType: requestDurationTypeEnum,
  duration: z.coerce.number().positive(),
  message: z.string().optional(),
})
