import { getSession } from "@/app/(main)/SeesionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import React, { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import Linkify from "./Linkify";
import FollowerCount from "./FollowerCount";

interface UserToolTipProps extends PropsWithChildren {
  user: UserData;
}

export default function UserToolTip({ children, user }: UserToolTipProps) {
  const { user: loggedInUser } = getSession();

  const followerState: FollowerInfo = {
    followers: user?._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser?.id
    ),
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="mt-2">
          <div className="flex max-w-52 flex-col gap-1 break-words px-1 py-2 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={40} avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser?.id !== user?.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount userId={user?.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
