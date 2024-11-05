import React from "react";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import UserToFollow from "./UserToFollow";

export default async function WhoToFollow(): Promise<React.JSX.Element | null> {
  const { user } = await validateRequest();
  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who To Follow</div>
      {usersToFollow &&
        usersToFollow.length > 0 &&
        usersToFollow.map((user) => <UserToFollow key={user.id} user={user} />)}
    </div>
  );
}
