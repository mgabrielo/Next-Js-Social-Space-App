import { AuthUser } from "@/lib/types";
import Link from "next/link";
import React, { JSXElementConstructor } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";

export default async function WhoToFollow(): Promise<React.JSX.Element | null> {
  const { user } = await validateRequest();
  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id,
      },
    },
    select: userDataSelect,
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who To Follow</div>
      {usersToFollow &&
        usersToFollow.length > 0 &&
        usersToFollow.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3"
          >
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
            <Button>Follow</Button>
          </div>
        ))}
    </div>
  );
}
