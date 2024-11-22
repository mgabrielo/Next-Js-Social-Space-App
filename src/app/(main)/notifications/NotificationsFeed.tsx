"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostLoadingSkeleton from "@/components/posts/PostLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { NotificationPage, postPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Notification from "./Notification";
import { useEffect } from "react";

export default function NotificationsFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {}
        )
        .json<NotificationPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch(`/api/notifications/marked-as-read`),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.error("failed to mark notification as read : ", error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);
  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  if (status === "pending") {
    return <PostLoadingSkeleton />;
  }

  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No Notifications available yet
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        Error Occured getting Notifications
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {notifications.length > 0 &&
        notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      {isFetchingNextPage && <Loader2 className="mx-auto animate-spin my-3" />}
    </InfiniteScrollContainer>
  );
}
