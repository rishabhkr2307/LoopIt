import { ItemDialogForm } from '@/components/item-dialog-form'
import { ProfileDialogForm } from '@/components/profile-dialog-form'
import SignOut from '@/components/signout'
import { Card, CardContent } from '@/components/ui/card'
import { auth } from '@/lib/auth/server'

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: session } = await auth.getSession()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Card>
        <CardContent>
          <p>Hi, {JSON.stringify(session, null, 2)}</p>
          <SignOut />
          <ItemDialogForm
            dialogBtnText="Register Item"
            buttonText="Register"
            description="Register the item you want to lend."
            title="Register Item"
          />
          <ProfileDialogForm
            dialogBtnText="Edit Profile"
            buttonText="Edit"
            description="Edit your profile"
            title="Edit Profile"
          />
        </CardContent>
      </Card>
    </div>
  )
}
