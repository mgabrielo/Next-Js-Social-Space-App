import { Metadata } from "next";
import BookmarkFeed from "./BookmarkFeed";
import TrendSideBar from "@/components/TrendSideBar";
import { getTrendingTopics, getUsersToFollow } from "@/hooks/new-hook";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default async function Page() {
  const trendingTopics = await getTrendingTopics();
  const usersToFollow = await getUsersToFollow();
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarkFeed />
      </div>
      {usersToFollow && (
        <TrendSideBar
          trendingTopics={trendingTopics}
          usersToFollow={usersToFollow}
        />
      )}
    </main>
  );
}
