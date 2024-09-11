import React from "react";
import { getTrendingTopics } from "./TrendSideBar";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";

export default async function TrendingTopics(): Promise<React.JSX.Element> {
  const trendingTopics = await getTrendingTopics();
  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">TrendingTopics</div>
      {trendingTopics.length > 0 &&
        trendingTopics.map(({ hashtag, count }) => {
          const title = hashtag.split("#")[1];
          return (
            <Link key={title} href={`/hashtag/${title}`} className="block">
              <p
                className="line-clamp-1 break-all font-semibold hover:underline"
                title={hashtag}
              >
                {hashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })}
    </div>
  );
}
