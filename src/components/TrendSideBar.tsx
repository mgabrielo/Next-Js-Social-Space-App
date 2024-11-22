import React, { Suspense } from "react";
import WhoToFollow from "./WhoToFollow";
import { Loader2 } from "lucide-react";
import TrendingTopics from "./TrendingTopics";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { validateRequest } from "@/auth";

export default async function TrendSideBar() {
  const trendingTopics = await getTrendingTopics();
  const usersToFollow = await getUsersToFollow();
  return (
    <div className="sticky top-[5.25rem] hidden md:block w-72 lg:w-80 h-fit flex-none space-y-5">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        {usersToFollow && <WhoToFollow usersToFollow={usersToFollow} />}
        {trendingTopics && <TrendingTopics trendingTopics={trendingTopics} />}
      </Suspense>
    </div>
  );
}

export const getUsersToFollow = async () => {
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
  return usersToFollow;
};

export const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
        SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) as count
        FROM posts
        GROUP BY (hashtag)
        ORDER BY count DESC, hashtag ASC
        LIMIT 5
        `;
    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 1 * 60 * 60,
  }
);
