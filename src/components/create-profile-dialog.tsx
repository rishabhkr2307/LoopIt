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
import { createProfile } from '@/app/actions/profile'

export function CreateProfileDialog({ open }: { open: boolean }) {
  const [state, formAction, isPending] = useActionState(createProfile, null)

  return (
    <Dialog open={open}>
      <DialogTrigger
        render={
          <Button hidden variant="outline">
            Create Profile
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create Profile</DialogTitle>
            <DialogDescription>Please create a profile before you continue</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Avatar</Label>
              <Input id="avatar" name="avatar" type="file" accept="image/*" />
            </Field>
            <Field>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" placeholder="Your bio goes here" />
            </Field>
            <Field>
              <Label htmlFor="name">City</Label>
              <Input id="city" name="city" type="text" placeholder="Delhi" required />
            </Field>
            <Field>
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" type="number" placeholder="110001" required />
            </Field>
            {state?.error && (
              <div className="rounded-md py-2 text-sm text-red-500">{state.error}</div>
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
