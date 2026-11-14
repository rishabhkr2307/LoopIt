import FilterPage from '@/components/filter-page'
import { getItemsWithFilters } from './actions/items'
import { getUserProfile } from './actions/profile'
import { CreateProfileDialog } from '@/components/create-profile-dialog'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { success, data: profile } = await getUserProfile()
  const { category, cityId = profile?.cityId, orderByPrice, orderByTime } = await searchParams
  if (!success)
    return (
      <div>
        <CreateProfileDialog open={!success} />
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
  })
  return <FilterPage items={data ?? []} />
}
