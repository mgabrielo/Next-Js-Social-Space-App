"use client";
import React, { Suspense } from "react";
import WhoToFollow from "./WhoToFollow";
import { Loader2 } from "lucide-react";
import TrendingTopics from "./TrendingTopics";
import { UserData } from "@/lib/types";

interface TrendingTopicsProps {
  usersToFollow: UserData[];
  trendingTopics: {
    hashtag: string;
    count: number;
  }[];
}

export default function TrendSideBar({
  usersToFollow,
  trendingTopics,
}: TrendingTopicsProps) {
  return (
    <div className="sticky top-[5.25rem] hidden md:block w-72 lg:w-80 h-fit flex-none space-y-5">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        {usersToFollow && <WhoToFollow usersToFollow={usersToFollow} />}
        {trendingTopics && <TrendingTopics trendingTopics={trendingTopics} />}
      </Suspense>
    </div>
  );
}
