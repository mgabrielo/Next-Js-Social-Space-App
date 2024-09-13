"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import React from "react";
import { useToast } from "./ui/use-toast";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";
interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}
const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data } = useFollowerInfo(userId, initialState);
  const queryKey: QueryKey = ["follower-info", userId];
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
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
    <Button
      onClick={() => mutate()}
      variant={data.isFollowedByUser ? "secondary" : "default"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
