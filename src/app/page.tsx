import { CreateItemDialog } from '@/components/create-item-dialog'
import { getItemsNearMe } from './actions/items'
import { ItemCard } from '@/components/item-card'

export default async function Home() {
  const { success, error, data } = await getItemsNearMe()

  if (!success || !data) return <div>Failed {JSON.stringify(error, null, 2)}</div>
  if (data.length == 0)
    return (
      <div>
        No Items exists <CreateItemDialog />
      </div>
    )
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      {data.map((item) => (
        <ItemCard
          key={item.id}
          name={item.name}
          description={item.description}
          imageUrl={item.imageUrl}
          pricePerDay={item.pricePerDay}
        />
      ))}
      <CreateItemDialog />
    </div>
  )
}
