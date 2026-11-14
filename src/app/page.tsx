import { CreateItemDialog } from '@/components/create-item-dialog'
import { getItemsNearMe } from './actions/items'
import { profileExists } from './actions/profile'
import { CreateProfileDialog } from '@/components/create-profile-dialog'
import SignOut from '@/components/signout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { ItemCard } from '@/components/item-card'

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
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex p-4 md:gap-6 md:p-6">
              {data.map((item) => (
                <ItemCard
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  imageUrl={item.imageUrl}
                  pricePerDay={item.pricePerDay}
                />
              ))}
              <CreateItemDialog />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
