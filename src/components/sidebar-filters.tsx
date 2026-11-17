'use client'
import { useState } from 'react'
import { Button } from './ui/button'
import { XIcon } from '@phosphor-icons/react'
import { ScrollArea } from './ui/scroll-area'
import { Checkbox } from './ui/checkbox'
import { useQueryState } from 'nuqs'
import { FilterSection } from './filter-section'
import { CreateItemDialog } from './create-item-dialog'
import { itemCategories, itemPricing, itemTimings, popularCities } from '@/constants'

export function SidebarFilters() {
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [category, setCategory] = useQueryState('category', {
    shallow: false,
  })
  const [orderByPrice, setOrderByPrice] = useQueryState('orderByPrice', {
    shallow: false,
  })
  const [orderByTiming, setOrderByTiming] = useQueryState('orderByTime', {
    shallow: false,
  })
  const [popCityId, setPopCityId] = useQueryState('cityId', {
    shallow: false,
  })
  const activeFilters = category || orderByPrice || orderByTiming || popCityId ? 1 : 0

  const toggleCategory = (category: string) => {
    setCategory((prev) => (prev == category ? null : category))
  }
  const toggleOrderByPrice = (order: string) => {
    setOrderByPrice((prev) => (prev == order ? null : order))
  }
  const toggleOrderByTiming = (order: string) => {
    setOrderByTiming((prev) => (prev == order ? null : order))
  }
  const togglePopCityId = (cityId: string) => {
    setPopCityId((prev) => (prev == cityId ? null : cityId))
  }

  const clearFilters = () => {
    setCategory(null)
    setOrderByPrice(null)
    setOrderByTiming(null)
    setPopCityId(null)
  }

  const ratings = [4, 3, 2, 1]

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center gap-2"
        >
          Filters
        </Button>
        {activeFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm lg:hidden">
          <div className="bg-background fixed inset-y-0 right-0 z-50 w-full max-w-xs p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                <XIcon className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="pr-4">
                {/* Filter Sections */}
                <FilterContent />
              </div>
            </ScrollArea>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear all
              </Button>
              <Button onClick={() => setShowMobileFilters(false)}>Apply filters</Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>
        <FilterContent />
      </div>
    </>
  )

  function FilterContent() {
    return (
      <div className="space-y-1">
        <FilterSection title="Categories">
          <div className="space-y-2">
            {itemCategories.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${item.value}`}
                  checked={category == item.value}
                  onCheckedChange={() => toggleCategory(item.value)}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>
        <FilterSection title="Pricing">
          <div className="space-y-2">
            {itemPricing.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`orderByPrice-${item.value}`}
                  checked={orderByPrice == item.value}
                  onCheckedChange={() => toggleOrderByPrice(item.value)}
                />
                <label
                  htmlFor={`orderByPrice-${orderByPrice}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Timing">
          <div className="space-y-2">
            {itemTimings.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`orderByTiming-${item.value}`}
                  checked={orderByTiming == item.value}
                  onCheckedChange={() => toggleOrderByTiming(item.value)}
                />
                <label
                  htmlFor={`orderByTiming-${orderByTiming}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Popular Cities">
          <div className="space-y-2">
            {popularCities.map((city) => (
              <div key={city.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`popCityId-${city.value}`}
                  checked={popCityId == city.value}
                  onCheckedChange={() => togglePopCityId(city.value)}
                />
                <label
                  htmlFor={`popCityId-${popCityId}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {city.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Rating">
          <div className="space-y-2">
            {ratings.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {Array.from({ length: rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 fill-current text-yellow-400"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                  <span className="ml-1">& Up</span>
                </label>
              </div>
            ))}
          </div>
        </FilterSection>
        <FilterSection title="Lend Your Item">
          <CreateItemDialog />
        </FilterSection>
      </div>
    )
  }
}
