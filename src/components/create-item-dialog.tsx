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
import { PlusIcon } from '@phosphor-icons/react'
import { useActionState, useState } from 'react'
import { createItem } from '@/app/actions/items'

export function CreateItemDialog() {
  const [state, formAction, isPending] = useActionState(createItem, null)
  const [category, setCategory] = useState('electronics_gadgets')
  const [status, setStatus] = useState('available')
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
  const itemStatus = [
    { label: 'Available', value: 'available' },
    { label: 'Unavailable', value: 'unavailable' },
    { label: 'Archive', value: 'archived' },
  ] as const
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" className="flex justify-center items-center w-full">
            <span>Item</span>
            <PlusIcon />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Create Item</DialogTitle>
            <DialogDescription>Create a new Item</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="image">Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" required />
            </Field>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select
                items={itemCategories}
                value={category}
                onValueChange={(value) => setCategory(value ?? 'electronics_gadgets')}
              >
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
              <Label htmlFor="price_per_day">Price Per Day</Label>
              <Input id="price_per_day" name="price_per_day" placeholder="0" type="number" />
            </Field>
            <Field>
              <Label htmlFor="price_per_week">Price Per Week</Label>
              <Input id="price_per_week" name="price_per_week" placeholder="0" type="number" />
            </Field>
            <Field>
              <Label htmlFor="price_per_month">Price Per Month</Label>
              <Input id="price_per_month" name="price_per_month" placeholder="0" type="number" />
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                items={itemStatus}
                value={status}
                onValueChange={(value) => setStatus(value ?? 'available')}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemStatus.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="status" value={status} />
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
