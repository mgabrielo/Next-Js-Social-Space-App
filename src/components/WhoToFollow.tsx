"use client";
import React from "react";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { UserData, getUserDataSelect } from "@/lib/types";
import UserToFollow from "./UserToFollow";

interface WhoToFollowProps {
  usersToFollow: UserData[];
}
export default function WhoToFollow({ usersToFollow }: WhoToFollowProps) {
  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who To Follow</div>
      {usersToFollow &&
        usersToFollow.length > 0 &&
        usersToFollow.map((user) => <UserToFollow key={user.id} user={user} />)}
    </div>
  );
}
