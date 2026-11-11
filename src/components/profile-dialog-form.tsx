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

export function ProfileDialogForm({
  dialogBtnText,
  title,
  description,
  buttonText,
  data,
}: {
  dialogBtnText: string
  title: string
  description: string
  buttonText: string
  data?: {
    avatar: string
    bio: string
    city: string
    pincode: string
  }
}) {
  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline">{dialogBtnText}</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Avatar</Label>
              <Input id="avatar" name="avatar" type="file" />
            </Field>
            <Field>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" defaultValue={data?.bio} />
            </Field>
            <Field>
              <Label htmlFor="name">City</Label>
              <Input id="city" name="city" type="text" defaultValue={data?.city} />
            </Field>
            <Field>
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" name="pincode" type="number" defaultValue={data?.pincode} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit">{buttonText}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
