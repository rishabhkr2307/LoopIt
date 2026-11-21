export const itemCategories = [
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

export const itemStatus = [
  { label: 'Available', value: 'available' },
  { label: 'Rented', value: 'rented' },
  { label: 'Archive', value: 'archived' },
] as const

export const itemPricing = [
  { label: 'Lowest First', value: 'asc' },
  { label: 'Highest First', value: 'desc' },
] as const
export const itemTimings = [
  { label: 'Newest First', value: 'desc' },
  { label: 'Oldest First', value: 'asc' },
] as const

export const reviewType = [
  { label: 'Item', value: 'item' },
  { label: 'Owner', value: 'owner' },
  { label: 'Borrower', value: 'borrower' },
] as const

export const requestDurationType = [
  { label: 'Days', value: 'days' },
  { label: 'Weeks', value: 'weeks' },
  { label: 'Months', value: 'months' },
] as const
