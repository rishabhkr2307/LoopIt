import FilterPage from '@/components/filter-page'
import { CreateProfileDialog } from '@/components/create-profile-dialog'
import { getItemsWithFilters } from '@/app/actions/items'
import { auth } from '@/lib/auth/server'
import { db } from '@/db'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { data: session } = await auth.getSession()
  const profile = await db.query.profiles.findFirst({
    where: { userId: session?.user.id },
  })
  const {
    category,
    cityId = profile?.cityId,
    orderByPrice,
    orderByTime,
    searchQ = '',
  } = await searchParams
  if (!profile)
    return (
      <div>
        <CreateProfileDialog open={!profile} />
      </div>
    )
  const { data } = await getItemsWithFilters({
    category: typeof category == 'string' ? category : undefined,
    cityId: typeof cityId == 'string' ? cityId : undefined,
    orderByPrice:
      (typeof orderByPrice == 'string' && orderByPrice == 'asc') || orderByPrice == 'desc'
        ? orderByPrice
        : undefined,
    orderByTime:
      (typeof orderByTime == 'string' && orderByTime == 'asc') || orderByTime == 'desc'
        ? orderByTime
        : undefined,
    searchQ: typeof searchQ == 'string' ? searchQ : undefined,
  })
  return (
    <FilterPage items={data?.items ?? []} profile={profile} reviewInfo={data?.reviewInfo ?? []} />
  )
}
