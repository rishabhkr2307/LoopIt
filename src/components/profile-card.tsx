'use client'
import { City } from '@/db/schema/cities'
import { CreateItemDialog } from './create-item-dialog'
import { EditProfileDialog } from './edit-profile-dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'
import { Profile } from '@/db/schema/profiles'
import { MapPinIcon, StarIcon } from '@phosphor-icons/react'
import { ButtonGroup } from './ui/button-group'
import { Review } from '@/db/schema/reviews'

function ProfileCard({
  profile,
  isOwner,
  city,
  reviews,
}: {
  profile: Profile
  isOwner?: boolean
  city: City
  reviews: Review[]
}) {
  return (
    <div className="md:col-span-1">
      <Card className="p-0">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <Avatar className="size-20">
              <AvatarImage src={profile.avatar!} alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex flex-col text-sm text-center">
              <span className="font-bold">{profile.fullName}</span>
              <span>{profile.bio}</span>
              <span className="flex gap-2 mt-2 justify-center items-center">
                <MapPinIcon />
                {city.name}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                <StarIcon className="fill-primary text-primary h-4 w-4" />
                <span className="text-sm font-medium">
                  {reviews && reviews.length > 0
                    ? (reviews.reduce((sum, r) => (sum += r.rating), 0) / reviews.length)
                        .toString()
                        .slice(0, 4)
                    : 0}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                {reviews ? reviews.length : 0} reviews
              </p>
            </div>

            {isOwner && (
              <div className="w-full flex justify-center items-center">
                <ButtonGroup>
                  <CreateItemDialog />
                  <EditProfileDialog profile={profile} city={city} />
                </ButtonGroup>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileCard
