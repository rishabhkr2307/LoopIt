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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export function ItemDialogForm({
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
    name: string
    description: string
    image: string
    category: string
    price: string
  }
}) {
  const itemCategories = [
    { label: 'Electronics & Gadgets', value: 'electronics_gadgets' },
    { label: 'Tools & Equipment', value: 'tools_equipment' },
    { label: 'Fashion & Accessories', value: 'fashion_accessories' },
    { label: 'Furniture & Home', value: 'furniture_home' },
    { label: 'Sports & Outdoors', value: 'sports_outdoors' },
    { label: 'Vehicles & Mobility', value: 'vehicles_mobility' },
    { label: 'Events & Party Supplies', value: 'events_party_supplies' },
    { label: 'Baby & Kids', value: 'baby_kids' },
    { label: 'Appliances', value: 'appliances' },
    { label: 'Travel & Luggage', value: 'travel_luggage' },
    { label: 'Construction & Industrial', value: 'construction_industrial' },
    { label: 'Music & Instruments', value: 'music_instruments' },
    { label: 'Office & Business', value: 'office_business' },
    { label: 'Home Decor & Lifestyle', value: 'home_decor_lifestyle' },
    { label: 'Photography & Production', value: 'photography_production' },
    { label: 'Entertainment & Recreation', value: 'entertainment_recreation' },
  ] as const
  const status = [
    { label: 'Available', value: 'available' },
    { label: 'Unavailable', value: 'unavailable' },
    { label: 'Archive', value: 'archived' },
  ] as const
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
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={data?.name} />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={data?.description} />
            </Field>
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select items={itemCategories} defaultValue="electronics_gadgets">
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="name">Price</Label>
              <Input id="price" name="price" type="number" defaultValue={data?.price} />
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select items={status} defaultValue="available">
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {status.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
