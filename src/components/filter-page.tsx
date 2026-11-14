'use client'
import { SidebarFilters } from './sidebar-filters'
import { ItemCard } from './item-card'
import { Item } from '@/db/schema/items'

export default function FilterPage({ items }: { items: Item[] }) {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">LoopIt</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <SidebarFilters />

        {/* Product Grid */}
        <div className="flex-1">
          <div className="text-muted-foreground mb-4 text-sm">{items.length} items found</div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <ItemCard key={product.id} product={product} />
            ))}
          </div>

          {items.length === 0 && (
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
