"use client";
import { UserData } from "@/lib/types";
import Link from "next/link";
import React from "react";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import UserToolTip from "./UserToolTip";

const UserToFollow = ({ user }: { user: UserData }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <UserToolTip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      <FollowButton
        userId={user.id}
        initialState={{
          followers: user._count.followers,
          isFollowedByUser: user.followers.some(
            ({ followerId }) => followerId === user.id
          ),
        }}
      ></FollowButton>
    </div>
  );
};

export default UserToFollow;
