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

interface PostProps {
  post: postData;
}

const Post = ({ post }: PostProps) => {
  const { user } = getSession();
  return (
    <article className="group/post space-y-3 rounded-xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
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
    </article>
  );
};

export default Post;
