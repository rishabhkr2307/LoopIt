'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Field } from './ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { InfinityIcon } from '@phosphor-icons/react'

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
const itemPricings = [
  { label: 'Low to High', value: 'price_asc' },
  { label: 'High to Low', value: 'price_desc' },
]
const itemTimings = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [category, setCategory] = React.useState('Category')
  const [pricing, setPricing] = React.useState('Pricing')
  const [timing, setTiming] = React.useState('Timings')
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <InfinityIcon className="size-5!" />
              <span className="text-base font-semibold">LoopIt</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-2 mt-4">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <Field>
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
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Field>
              <Select
                items={itemPricings}
                value={pricing}
                onValueChange={(value) => setPricing(value ?? 'Pricing')}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemPricings.map((price) => (
                      <SelectItem key={price.value} value={price.value}>
                        {price.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Field>
              <Select
                items={itemTimings}
                value={timing}
                onValueChange={(value) => setTiming(value ?? 'Timing')}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {itemTimings.map((time) => (
                      <SelectItem key={time.value} value={time.value}>
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}
