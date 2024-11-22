import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export interface ParamsComments {
  params: {
    postId: string;
  };
}

export async function GET(
  req: NextRequest,
  { params: { postId } }: ParamsComments
) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 5;
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: getCommentDataInclude(user.id),
      orderBy: {
        createdAt: "asc",
      },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const previousCursor = comments.length > pageSize ? comments[0].id : null;
    const data: CommentPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    };
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server Error" },
      { status: 500 }
    );
  }
}
