import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookmarkInfo, LikeInfo } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export interface ParamsLikes {
  params: {
    postId: string;
  };
}
export async function POST(
  req: NextRequest,
  { params: { postId } }: ParamsLikes
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return NextResponse.json(
        { error: "unathorized access" },
        { status: 401 }
      );
    }

    await prisma.bookmark.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId: postId,
        },
      },
      create: {
        userId: loggedInUser.id,
        postId: postId,
      },
      update: {},
    });
    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params: { postId } }: ParamsLikes
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return NextResponse.json(
        { error: "unathorized access" },
        { status: 401 }
      );
    }
    const bookmarks = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId: postId,
        },
      },
    });
    if (!bookmarks) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmarks,
    };
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params: { postId } }: ParamsLikes
) {
  try {
    const { user: loggedInUser } = await validateRequest();
    if (!loggedInUser) {
      return NextResponse.json(
        { error: "unathorized access" },
        { status: 401 }
      );
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId: postId,
      },
    });
    return new NextResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server Error" },
      { status: 500 }
    );
  }
}
