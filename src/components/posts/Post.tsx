"use client";
import { postData } from "@/lib/types";
import Link from "next/link";
import React from "react";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { getSession } from "@/app/(main)/SeesionProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserToolTip from "../UserToolTip";
import { useRouter } from "next/navigation";
import LikeButton from "./LikeButton";

interface PostProps {
  post: postData;
}

const Post = ({ post }: PostProps) => {
  const router = useRouter();
  const { user } = getSession();
  const handlePostClick = () => {
    router.push(`/posts/${post.id}`);
  };
  return (
    <article className="group/post space-y-3 rounded-xl bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3" onClick={handlePostClick}>
        <div className="flex justify-between">
          <div className=" flex flex-wrap gap-3">
            <UserToolTip user={post.user}>
              <Link href={`/users/${post.user.username}`}>
                <UserAvatar avatarUrl={post.user.avatarUrl} />
              </Link>
            </UserToolTip>
            <div>
              <UserToolTip user={post.user}>
                <Link
                  href={`/users/${post.user.username}`}
                  className="block font-medium hover:underline"
                >
                  {post.user.displayName}
                </Link>
              </UserToolTip>
              <Link
                href={`/posts/${post.id}`}
                suppressHydrationWarning
                className="block text-sm text-muted-foreground hover:underline"
              >
                {formatRelativeDate(post.createdAt)}
              </Link>
            </div>
          </div>
          {post.user.id === user.id && (
            <PostMoreButton
              post={post}
              className="opacity-0 transition-opacity group-hover/post:opacity-100"
            />
          )}
        </div>
        <Linkify>
          <div className="whitespace-pre-line break-words">{post.content}</div>
        </Linkify>
      </div>
      <hr className="text-muted-foreground" />
      <LikeButton
        postId={post.id}
        initialState={{
          likes: post._count.likes,
          isLikedByUser: post.likes.some((like) => like.userId == user.id),
        }}
      />
    </article>
  );
};

export default Post;
