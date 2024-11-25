"use client";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  initialState: MessageCountInfo;
}

const MessagesButton = ({ initialState }: Props) => {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href={"/messages"}>
        <div className="relative">
          <Mail />
          {data.unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary text-primary-foreground px-1 text-xs font-medium tabular-nums">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
};

export default MessagesButton;
