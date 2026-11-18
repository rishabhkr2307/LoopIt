import { defineRelations } from 'drizzle-orm'
import { profiles } from './schema/profiles'
import { items } from './schema/items'
import { messages } from './schema/messages'
import { requests } from './schema/requests'
import { conversations } from './schema/conversations'
import { cities } from './schema/cities'
import { reviews } from './schema/reviews'

export const relations = defineRelations(
  {
    profiles,
    items,
    messages,
    requests,
    conversations,
    cities,
    reviews,
  },
  (r) => ({
    requests: {
      item: r.one.items({
        from: r.requests.itemId,
        to: r.items.id,
      }),
      owner: r.one.profiles({
        from: r.requests.ownerId,
        to: r.profiles.userId,
      }),
      borrower: r.one.profiles({
        from: r.requests.borrowerId,
        to: r.profiles.userId,
      }),
      conversation: r.one.conversations({
        from: r.requests.itemId,
        to: r.conversations.itemId,
      }),
    },
    items: {
      owner: r.one.profiles({
        from: r.items.ownerId,
        to: r.profiles.userId,
      }),
      requests: r.many.requests({
        from: r.items.id,
        to: r.requests.itemId,
      }),
      reviews: r.many.reviews({
        from: r.items.id,
        to: r.reviews.itemId,
      }),
    },
    profiles: {
      city: r.one.cities({
        from: r.profiles.cityId,
        to: r.cities.id,
      }),
      items: r.many.items({
        from: r.profiles.userId,
        to: r.items.ownerId,
      }),
      ownerRequests: r.many.requests({
        from: r.profiles.userId,
        to: r.requests.ownerId,
      }),
      borrowerRequests: r.many.requests({
        from: r.profiles.userId,
        to: r.requests.borrowerId,
      }),
      ownerConversations: r.many.conversations({
        from: r.profiles.userId,
        to: r.conversations.ownerId,
      }),
      borrowerConversations: r.many.conversations({
        from: r.profiles.userId,
        to: r.conversations.borrowerId,
      }),
    },
    conversations: {
      item: r.one.items({
        from: r.conversations.itemId,
        to: r.items.id,
      }),
      owner: r.one.profiles({
        from: r.conversations.ownerId,
        to: r.profiles.userId,
      }),
      borrower: r.one.profiles({
        from: r.conversations.borrowerId,
        to: r.profiles.userId,
      }),
      messages: r.many.messages({
        from: r.conversations.id,
        to: r.messages.conversationId,
      }),
    },
    messages: {
      conversation: r.one.conversations({
        from: r.messages.conversationId,
        to: r.conversations.id,
      }),
      sender: r.one.profiles({
        from: r.messages.senderId,
        to: r.profiles.userId,
      }),
    },
    reviews: {
      item: r.one.items({
        from: r.reviews.itemId,
        to: r.items.id,
      }),
    },
  }),
)
