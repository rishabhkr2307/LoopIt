import { CreateItemDialog } from '@/components/create-item-dialog'
import { getItemsNearMe } from './actions/items'
import { profileExists } from './actions/profile'
import { CreateProfileDialog } from '@/components/create-profile-dialog'
import SignOut from '@/components/signout'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"></div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
