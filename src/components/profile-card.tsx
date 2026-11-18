'use client'
import { City } from '@/db/schema/cities'
import { CreateItemDialog } from './create-item-dialog'
import { EditProfileDialog } from './edit-profile-dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'
import { Profile } from '@/db/schema/profiles'
import { MapPinIcon } from '@phosphor-icons/react'

function ProfileCard({
  profile,
  isOwner,
  city,
}: {
  profile: Profile
  isOwner: boolean
  city: City
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
              <span>{profile.bio}</span>
              <span className="flex gap-2 mt-2 justify-center items-center">
                <MapPinIcon />
                {city.name}
              </span>
            </div>
            {isOwner && (
              <div className="flex flex-col justify-between text-sm text-center">
                <CreateItemDialog />
                <EditProfileDialog profile={profile} city={city} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileCard
