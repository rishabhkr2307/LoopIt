import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ItemCard({
  name,
  description,
  imageUrl,
  pricePerDay,
}: {
  name: string
  description: string
  imageUrl: string
  pricePerDay: number
}) {
  return (
    <Card className="relative w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <Image
        src={imageUrl}
        alt={name}
        width={1024}
        height={1024}
        className="relative z-20 aspect-video w-full object-cover "
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">INR {pricePerDay} Per Day</Badge>
        </CardAction>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {description.slice(0, 100)}
          {description.length > 100 ? '...' : ''}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Item</Button>
      </CardFooter>
    </Card>
  )
}
