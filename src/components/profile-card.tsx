'use client'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Card, CardContent } from './ui/card'
import { Profile } from '@/db/schema/profiles'

function ProfileCard({ profile }: { profile: Profile }) {
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
            <div className="flex justify-between text-sm text-center">
              <span>{profile.bio}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileCard
