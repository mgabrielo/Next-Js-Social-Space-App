import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { MessageCountInfo } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { total_unread_count } = await streamServerClient.getUnreadCount(
      user.id
    );
    const data: MessageCountInfo = {
      unreadCount: total_unread_count,
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
