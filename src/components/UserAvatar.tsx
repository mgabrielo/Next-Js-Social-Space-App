"use client";
import Image from "next/image";
import React from "react";
import avatarDefault from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}
const UserAvatar = ({ avatarUrl, size, className }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || avatarDefault}
      alt={"user-avatar"}
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit rounded-full flex-none bg-secondary object-cover",
        className
      )}
    />
  );
};

export default UserAvatar;
