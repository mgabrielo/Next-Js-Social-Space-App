"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }
  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });
  if (!post) {
    throw new Error("Post Not Found");
  }
  if (post.userId !== user.id) {
    throw new Error("Unauthroized");
  }
  const deletedPost = await prisma.post.delete({
    where: {
      id: id,
    },
    include: postDataInclude,
  });

  return deletedPost;
}
