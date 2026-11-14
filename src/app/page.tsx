import FilterPage from '@/components/filter-page'
import { getItemsNearMe } from './actions/items'
import { profileExists } from './actions/profile'
import { CreateProfileDialog } from '@/components/create-profile-dialog'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const exists = await profileExists()
  if (!exists)
    return (
      <div>
        <CreateProfileDialog open={!exists} />
      </div>
    )
  const { data } = await getItemsNearMe()
  return <FilterPage items={data ?? []} />
}
