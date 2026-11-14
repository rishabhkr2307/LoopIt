import { CreateItemDialog } from '@/components/create-item-dialog'
import { getItemsNearMe } from './actions/items'
import { profileExists } from './actions/profile'
import { CreateProfileDialog } from '@/components/create-profile-dialog'
import SignOut from '@/components/signout'
import FilterDemo from '@/components/filter-demo'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const exists = await profileExists()
  if (!exists)
    return (
      <div>
        <CreateProfileDialog open={!exists} />
      </div>
    )
  const { success, error, data } = await getItemsNearMe()

  if (!success || !data) return <div>Failed {JSON.stringify(error, null, 2)}</div>
  if (data.length == 0)
    return (
      <div>
        No Items exists <CreateItemDialog />
        <SignOut />
      </div>
    )
  return <FilterDemo />
}
