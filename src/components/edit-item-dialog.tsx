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
import { PencilIcon } from '@phosphor-icons/react'
import { useActionState, useState } from 'react'
import { editItem } from '@/app/actions/items'
import { itemCategories, itemStatus } from '@/constants'
import { Item } from '@/db/schema/items'

export function EditItemDialog({ item }: { item: Item }) {
  const [state, formAction, isPending] = useActionState(editItem, null)
  const [category, setCategory] = useState('electronics_gadgets')
  const [status, setStatus] = useState('available')

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" className="flex justify-center items-center">
            <PencilIcon />
            <span>Edit</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Edit your old Item</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="image">Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </Field>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required defaultValue={item.name} />
            </Field>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="max-h-32 resize-none overflow-y-auto"
                id="description"
                name="description"
                required
                defaultValue={item.description}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select
                items={itemCategories}
                value={category}
                defaultValue={item.itemCategory}
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
              <Input
                id="price_per_day"
                name="price_per_day"
                placeholder="0"
                type="number"
                defaultValue={item.pricePerDay}
              />
            </Field>
            <Field>
              <Label htmlFor="price_per_week">Price Per Week</Label>
              <Input
                id="price_per_week"
                name="price_per_week"
                placeholder="0"
                type="number"
                defaultValue={item.pricePerWeek}
              />
            </Field>
            <Field>
              <Label htmlFor="price_per_month">Price Per Month</Label>
              <Input
                id="price_per_month"
                name="price_per_month"
                placeholder="0"
                type="number"
                defaultValue={item.pricePerMonth}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                items={itemStatus}
                value={status}
                defaultValue={item.itemStatus}
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
            <input type="hidden" name="item_id" value={item.id} />
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
