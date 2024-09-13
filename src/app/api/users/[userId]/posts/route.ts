import { NextRequest, NextResponse } from "next/server";
import { ParamsForm } from "../followers/route";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, postPage } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params: { userId } }: ParamsForm
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    if (!loggedInUser) {
      return NextResponse.json(
        { error: "unathorized access" },
        { status: 401 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        userId,
      },
      include: getPostDataInclude(loggedInUser.id),
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;
    const data: postPage = {
      posts: posts.slice(0, pageSize),
      nextCursor: nextCursor,
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
