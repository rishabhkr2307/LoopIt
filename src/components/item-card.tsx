import { PlusIcon, StarIcon } from '@phosphor-icons/react'
import { Button } from './ui/button'
import Image from 'next/image'
import { Item } from '@/db/schema/items'

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

export const ItemCard = ({ product }: { product: Item }) => (
  <div className="group overflow-hidden rounded-lg border">
    <div className="relative aspect-square overflow-hidden bg-gray-100">
      <Image
        src={product.imageUrl}
        alt={product.name}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
        width={1024}
        height={1024}
      />
    </div>
    <div className="p-4">
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-muted-foreground text-sm">
            {itemCategories.filter((item) => item.value == product.itemCategory)[0].label}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <StarIcon className="fill-primary text-primary h-4 w-4" />
            <span className="text-sm font-medium">4.8</span>
          </div>
          <p className="text-muted-foreground text-xs">101 reviews</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">${product.pricePerDay}</span>
          <span className="text-muted-foreground text-sm">Per Day</span>
        </div>
        <Button size="sm" className="h-8">
          <PlusIcon className="mr-2 h-4 w-4" />
          More
        </Button>
      </div>
    </div>
  </div>
)
