import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserProfile from "./components/UserProfile";
import UserPosts from "./components/UserPosts";
import TrendSideBar from "@/components/TrendSideBar";
import { getTrendingTopics, getUsersToFollow } from "@/hooks/new-hook";

interface pageProps {
  params: {
    username: string;
  };
}
const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });
  if (!user) {
    notFound();
  }
  return user;
});

export async function generateMetadata({
  params: { username },
}: pageProps): Promise<Metadata> {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return {};
  }

  const user = await getUser(username, loggedInUser.id);
  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

const Page = async ({ params: { username } }: pageProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        {" "}
        You are not Authorized to view this page !!
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);
  const trendingTopics = await getTrendingTopics();
  const usersToFollow = await getUsersToFollow();
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-xl bg-card p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-center">
            {user.displayName} posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
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

export default Page;
