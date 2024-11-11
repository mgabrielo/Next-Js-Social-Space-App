"use client";
import { LikeInfo } from "@/lib/types";
import React from "react";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Heart, HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeProps {
  postId: string;
  initialState: LikeInfo;
}

const LikeButton = ({ postId, initialState }: LikeProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];
  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () => kyInstance.get(`/api/post/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/post/${postId}/likes`)
        : kyInstance.post(`/api/post/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);
      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
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
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500"
        )}
      />
      <span className="font-medium text-sm tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
};

export default LikeButton;
