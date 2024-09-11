import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude, postPage } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const posts = await prisma.post.findMany({
      include: postDataInclude,
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