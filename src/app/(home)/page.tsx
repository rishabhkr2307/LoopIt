import FilterPage from '@/components/filter-page'
import { CreateProfileDialog } from '@/components/create-profile-dialog'
import { getItemsWithFilters } from '@/app/actions/items'
import { auth } from '@/lib/auth/server'
import { db } from '@/db'
import { filterSchema } from '@/schema/filter'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { data: session } = await auth.getSession()
  const profile = await db.query.profiles.findFirst({
    where: { userId: session?.user.id },
    with: {
      notifications: {
        where: { isRead: false },
        limit: 10,
      },
    },
  })
  const filters = filterSchema.parse(await searchParams)
  if (!profile)
    return (
      <div>
        <CreateProfileDialog open={!profile} />
      </div>
    )
  const { data } = await getItemsWithFilters(filters)
  return (
    <FilterPage
      items={data?.items ?? []}
      profile={profile}
      reviewInfo={data?.reviewInfo ?? []}
      notifications={profile.notifications}
    />
  )
}
