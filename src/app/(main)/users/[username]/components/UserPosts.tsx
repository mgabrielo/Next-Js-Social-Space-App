"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostLoadingSkeleton from "@/components/posts/PostLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { postPage } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface UserPostsProps {
  userId: string;
}

export default function UserPosts({ userId }: UserPostsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<postPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];
  if (status === "pending") {
    return <PostLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        User has no Post available yet
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Error Occured getting posts
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.length > 0 &&
        posts.map((post) => <Post key={post.id} post={post} />)}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin my-3" />}
    </InfiniteScrollContainer>
  );
}
