"use client";
import { postData } from "@/lib/types";
import Link from "next/link";
import React, { useState } from "react";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { getSession } from "@/app/(main)/SeesionProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserToolTip from "../UserToolTip";
import { useRouter } from "next/navigation";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { MessageSquare } from "lucide-react";
import Comments from "../comments/Comments";

interface PostProps {
  post: postData;
}

const Post = ({ post }: PostProps) => {
  const router = useRouter();
  const { user } = getSession();
  const [showComments, setShowComments] = useState(false);
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
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              likes: post._count.likes,
              isLikedByUser: post.likes.some((like) => like.userId == user.id),
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments((value) => !value)}
          />
        </div>
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId == user.id
            ),
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
};

export default Post;

interface CommentButtonProps {
  post: postData;
  onClick: () => void;
}

function CommentButton({ post, onClick }: CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}
        <span className="hidden sm:inline"> {"comments"}</span>
      </span>
    </button>
  );
}
