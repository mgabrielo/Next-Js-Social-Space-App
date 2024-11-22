import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { unstable_cache } from "next/cache";

export const getUsersToFollow = async () => {
  const { user } = await validateRequest();
  const usersToFollow =
    user &&
    (await prisma.user.findMany({
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
    }));
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
