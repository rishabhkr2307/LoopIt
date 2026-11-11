import { defineRelations } from 'drizzle-orm'
import { profiles } from './schema/profiles'
import { items } from './schema/items'
import { messages } from './schema/messages'
import { prices } from './schema/prices'
import { requests } from './schema/requests'
import { conversations } from './schema/conversations'
import { cities } from './schema/cities'

export const relations = defineRelations({
  profiles,
  items,
  messages,
  prices,
  requests,
  conversations,
  cities,
})
