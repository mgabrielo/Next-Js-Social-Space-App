import TrendSideBar from "@/components/TrendSideBar";
import { getTrendingTopics, getUsersToFollow } from "@/hooks/new-hook";
import SearchResults from "./SearchResults";
import { Metadata } from "next";

interface Props {
  searchParams: { q: string };
}

export function generateMetadata({ searchParams: { q } }: Props): Metadata {
  return {
    title: `Search Results for "${q}"`,
  };
}

const page = async ({ searchParams: { q } }: Props) => {
  const trendingTopics = await getTrendingTopics();
  const usersToFollow = await getUsersToFollow();
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold line-clamp-1 break-all">
            Search Results for: {q}{" "}
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      {usersToFollow && (
        <TrendSideBar
          trendingTopics={trendingTopics}
          usersToFollow={usersToFollow}
        />
      )}
    </main>
  );
};

export default page;
