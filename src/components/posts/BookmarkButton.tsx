"use client";
import { BookmarkInfo } from "@/lib/types";
import React from "react";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Bookmark, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookmarkProps {
  postId: string;
  initialState: BookmarkInfo;
}

const BookmarkButton = ({ postId, initialState }: BookmarkProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/post/${postId}/bookmarks`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/post/${postId}/bookmarks`)
        : kyInstance.post(`/api/post/${postId}/bookmarks`),
    onMutate: async () => {
      toast({
        description: `Post ${
          data.isBookmarkedByUser ? "Removed From" : "Added to"
        } Bookmarks`,
      });
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return previousState;
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context);
      console.error(error);
      toast({
        variant: "destructive",
        description: "Error Occurred..Please try Again",
      });
    },
  });
  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary"
        )}
      />
    </button>
  );
};

export default BookmarkButton;
