'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from './ui/textarea'
import { useActionState } from 'react'
import { editProfile } from '@/app/actions/profile'
import { Profile } from '@/db/schema/profiles'
import { City } from '@/db/schema/cities'

export function EditProfileDialog({ profile, city }: { profile: Profile; city: City }) {
  const [state, formAction, isPending] = useActionState(editProfile, null)

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Edit Profile</Button>} />
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Edit your profile</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Avatar</Label>
              <Input id="avatar" name="avatar" type="file" accept="image/*" />
            </Field>
            <Field>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                className="max-h-32 resize-none overflow-y-auto"
                id="bio"
                name="bio"
                placeholder="Your bio goes here"
                defaultValue={profile.bio ?? ''}
              />
            </Field>
            <Field>
              <Label htmlFor="name">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Delhi"
                required
                defaultValue={city.name}
              />
            </Field>
            <Field>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                name="pincode"
                type="number"
                placeholder="110001"
                required
                defaultValue={city.pincode}
              />
            </Field>
            <input type="hidden" name="profile_id" value={profile.id} />
            {state?.error && (
              <div className="rounded-md py-2 text-sm text-red-500">{state.error}</div>
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
