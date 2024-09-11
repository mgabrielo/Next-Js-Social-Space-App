import React, { Suspense } from "react";
import WhoToFollow from "./WhoToFollow";
import { Loader2 } from "lucide-react";
import TrendingTopics from "./TrendingTopics";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export default function TrendSideBar() {
  return (
    <div className="sticky top-[5.25rem] hidden md:block w-72 lg:w-80 h-fit flex-none space-y-5">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        {/* @ts-ignore */}
        <WhoToFollow />
        {/* @ts-ignore */}
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

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
