"use client";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import UserAvatar from "@/components/UserAvatar";
import UserToolTip from "@/components/UserToolTip";
import { UserData } from "@/lib/types";
import { User } from "@prisma/client";
import Link from "next/link";

interface UserInfoSidebarProps {
  user: UserData;
  loggedInUser: any;
}

export default function UserInfoSidebar({
  user,
  loggedInUser,
}: UserInfoSidebarProps) {
  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About This User</div>
      <UserToolTip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div className="ml-2">
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id
            ),
          }}
        />
      )}
    </div>
  );
}
