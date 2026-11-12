import { defineRelations } from 'drizzle-orm'
import { profiles } from './schema/profiles'
import { items } from './schema/items'
import { messages } from './schema/messages'
import { requests } from './schema/requests'
import { conversations } from './schema/conversations'
import { cities } from './schema/cities'

export const relations = defineRelations({
  profiles,
  items,
  messages,
  requests,
  conversations,
  cities,
})
