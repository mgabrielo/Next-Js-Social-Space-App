"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentInclude, postData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export async function submitComment({
  post,
  content,
}: {
  post: postData;
  content: string;
}) {
  const { user } = await validateRequest();

  if (!user) {
    throw Error("Unauthorized");
  }

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const newComment = await prisma.comment.create({
    data: {
      content: contentValidated,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentInclude(user.id),
  });

  return newComment;
}
