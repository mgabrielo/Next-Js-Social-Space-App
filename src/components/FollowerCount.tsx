"use client";
import React from "react";
import { FollowerInfo } from "@/lib/types";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { formatNumber } from "@/lib/utils";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  return (
    <span>
      Followers:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
};

export default FollowerCount;
